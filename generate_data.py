"""Build the static site's model results from the course 50 Startups CSV."""

from __future__ import annotations

import itertools
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.feature_selection import RFE, SequentialFeatureSelector
from sklearn.linear_model import ElasticNetCV, LassoCV, LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import KFold, cross_val_score, train_test_split
from sklearn.preprocessing import StandardScaler


ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "50_Startups.csv"
OUTPUT = ROOT / "results.json"
SCRIPT_OUTPUT = ROOT / "results.js"
CV = KFold(n_splits=5, shuffle=True, random_state=0)


def evaluate(x_train, x_test, y_train, y_test, columns: list[str]) -> dict:
    model = LinearRegression().fit(x_train[columns], y_train)
    prediction = model.predict(x_test[columns])
    training_prediction = model.predict(x_train[columns])
    return {
        "features": columns,
        "rmse": round(float(np.sqrt(mean_squared_error(y_test, prediction))), 6),
        "r2": round(float(r2_score(y_test, prediction)), 6),
        "mae": round(float(mean_absolute_error(y_test, prediction)), 6),
        "train_rmse": round(float(np.sqrt(mean_squared_error(y_train, training_prediction))), 6),
    }


def main() -> None:
    data = pd.read_csv(DATA)
    y = data["Profit"]
    # California is the reference state. This produces exactly five predictors.
    x = pd.get_dummies(data.drop(columns="Profit"), columns=["State"], drop_first=True, dtype=int)
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=0)
    feature_names = list(x.columns)
    scaled = StandardScaler().fit_transform(x_train)
    methods: dict[str, list[dict]] = {}

    lasso = LassoCV(cv=CV, max_iter=100000, random_state=0).fit(scaled, y_train)
    lasso_rank = sorted(range(len(feature_names)), key=lambda i: (-abs(lasso.coef_[i]), i))
    methods["lasso"] = [
        evaluate(x_train, x_test, y_train, y_test, [feature_names[i] for i in lasso_rank[:k]])
        for k in range(1, 6)
    ]

    elastic = ElasticNetCV(l1_ratio=[0.2, 0.5, 0.8], cv=CV, max_iter=100000, random_state=0).fit(scaled, y_train)
    elastic_rank = sorted(range(len(feature_names)), key=lambda i: (-abs(elastic.coef_[i]), i))
    methods["elasticnet"] = [
        evaluate(x_train, x_test, y_train, y_test, [feature_names[i] for i in elastic_rank[:k]])
        for k in range(1, 6)
    ]

    methods["forward"] = []
    methods["rfe"] = []
    methods["exhaustive"] = []
    for k in range(1, 6):
        if k == len(feature_names):
            forward_features = feature_names.copy()
        else:
            selector = SequentialFeatureSelector(
                LinearRegression(), n_features_to_select=k, direction="forward",
                scoring="neg_root_mean_squared_error", cv=CV,
            ).fit(scaled, y_train)
            forward_features = [name for name, chosen in zip(feature_names, selector.get_support()) if chosen]
        methods["forward"].append(evaluate(x_train, x_test, y_train, y_test, forward_features))

        rfe = RFE(LinearRegression(), n_features_to_select=k).fit(scaled, y_train)
        rfe_features = [name for name, chosen in zip(feature_names, rfe.get_support()) if chosen]
        methods["rfe"].append(evaluate(x_train, x_test, y_train, y_test, rfe_features))

        best_features = min(
            itertools.combinations(feature_names, k),
            key=lambda columns: -cross_val_score(
                LinearRegression(), x_train[list(columns)], y_train,
                scoring="neg_root_mean_squared_error", cv=CV,
            ).mean(),
        )
        methods["exhaustive"].append(evaluate(x_train, x_test, y_train, y_test, list(best_features)))

    payload = {
        "dataset": "50_Startups.csv",
        "rows": len(data),
        "train_rows": len(x_train),
        "test_rows": len(x_test),
        "split": "80/20, random_state=0",
        "state_baseline": "California",
        "methods": methods,
    }
    serialized = json.dumps(payload, ensure_ascii=False, indent=2)
    OUTPUT.write_text(serialized + "\n", encoding="utf-8")
    SCRIPT_OUTPUT.write_text("window.RESULTS_DATA = " + serialized + ";\n", encoding="utf-8")
    for name, rows in methods.items():
        print(name, [(round(row["rmse"], 2), row["features"]) for row in rows])
    print(f"Saved {OUTPUT}")
    print(f"Saved {SCRIPT_OUTPUT}")


if __name__ == "__main__":
    main()
