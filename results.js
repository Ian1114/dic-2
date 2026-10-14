window.RESULTS_DATA = {
  "dataset": "50_Startups.csv",
  "rows": 50,
  "train_rows": 40,
  "test_rows": 10,
  "split": "80/20, random_state=0",
  "state_baseline": "California",
  "methods": {
    "lasso": [
      {
        "features": [
          "R&D Spend"
        ],
        "rmse": 8274.868018,
        "r2": 0.946459,
        "mae": 6772.45328,
        "train_rmse": 9493.580598
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend"
        ],
        "rmse": 8198.797191,
        "r2": 0.947439,
        "mae": 6886.594588,
        "train_rmse": 9078.617918
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend",
          "Administration"
        ],
        "rmse": 8803.77579,
        "r2": 0.939396,
        "mae": 7320.441615,
        "train_rmse": 9052.267249
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend",
          "Administration",
          "State_Florida"
        ],
        "rmse": 9068.541185,
        "r2": 0.935696,
        "mae": 7431.47327,
        "train_rmse": 9036.510816
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend",
          "Administration",
          "State_Florida",
          "State_New York"
        ],
        "rmse": 9137.990153,
        "r2": 0.934707,
        "mae": 7514.29366,
        "train_rmse": 9031.666613
      }
    ],
    "elasticnet": [
      {
        "features": [
          "R&D Spend"
        ],
        "rmse": 8274.868018,
        "r2": 0.946459,
        "mae": 6772.45328,
        "train_rmse": 9493.580598
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend"
        ],
        "rmse": 8198.797191,
        "r2": 0.947439,
        "mae": 6886.594588,
        "train_rmse": 9078.617918
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend",
          "Administration"
        ],
        "rmse": 8803.77579,
        "r2": 0.939396,
        "mae": 7320.441615,
        "train_rmse": 9052.267249
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend",
          "Administration",
          "State_New York"
        ],
        "rmse": 8997.199286,
        "r2": 0.936703,
        "mae": 7474.740626,
        "train_rmse": 9039.158955
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend",
          "Administration",
          "State_New York",
          "State_Florida"
        ],
        "rmse": 9137.990153,
        "r2": 0.934707,
        "mae": 7514.29366,
        "train_rmse": 9031.666613
      }
    ],
    "forward": [
      {
        "features": [
          "R&D Spend"
        ],
        "rmse": 8274.868018,
        "r2": 0.946459,
        "mae": 6772.45328,
        "train_rmse": 9493.580598
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend"
        ],
        "rmse": 8198.797191,
        "r2": 0.947439,
        "mae": 6886.594588,
        "train_rmse": 9078.617918
      },
      {
        "features": [
          "R&D Spend",
          "Administration",
          "Marketing Spend"
        ],
        "rmse": 8803.77579,
        "r2": 0.939396,
        "mae": 7320.441615,
        "train_rmse": 9052.267249
      },
      {
        "features": [
          "R&D Spend",
          "Administration",
          "Marketing Spend",
          "State_Florida"
        ],
        "rmse": 9068.541185,
        "r2": 0.935696,
        "mae": 7431.47327,
        "train_rmse": 9036.510816
      },
      {
        "features": [
          "R&D Spend",
          "Administration",
          "Marketing Spend",
          "State_Florida",
          "State_New York"
        ],
        "rmse": 9137.990153,
        "r2": 0.934707,
        "mae": 7514.29366,
        "train_rmse": 9031.666613
      }
    ],
    "rfe": [
      {
        "features": [
          "R&D Spend"
        ],
        "rmse": 8274.868018,
        "r2": 0.946459,
        "mae": 6772.45328,
        "train_rmse": 9493.580598
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend"
        ],
        "rmse": 8198.797191,
        "r2": 0.947439,
        "mae": 6886.594588,
        "train_rmse": 9078.617918
      },
      {
        "features": [
          "R&D Spend",
          "Administration",
          "Marketing Spend"
        ],
        "rmse": 8803.77579,
        "r2": 0.939396,
        "mae": 7320.441615,
        "train_rmse": 9052.267249
      },
      {
        "features": [
          "R&D Spend",
          "Administration",
          "Marketing Spend",
          "State_Florida"
        ],
        "rmse": 9068.541185,
        "r2": 0.935696,
        "mae": 7431.47327,
        "train_rmse": 9036.510816
      },
      {
        "features": [
          "R&D Spend",
          "Administration",
          "Marketing Spend",
          "State_Florida",
          "State_New York"
        ],
        "rmse": 9137.990153,
        "r2": 0.934707,
        "mae": 7514.29366,
        "train_rmse": 9031.666613
      }
    ],
    "exhaustive": [
      {
        "features": [
          "R&D Spend"
        ],
        "rmse": 8274.868018,
        "r2": 0.946459,
        "mae": 6772.45328,
        "train_rmse": 9493.580598
      },
      {
        "features": [
          "R&D Spend",
          "Marketing Spend"
        ],
        "rmse": 8198.797191,
        "r2": 0.947439,
        "mae": 6886.594588,
        "train_rmse": 9078.617918
      },
      {
        "features": [
          "R&D Spend",
          "Administration",
          "Marketing Spend"
        ],
        "rmse": 8803.77579,
        "r2": 0.939396,
        "mae": 7320.441615,
        "train_rmse": 9052.267249
      },
      {
        "features": [
          "R&D Spend",
          "Administration",
          "Marketing Spend",
          "State_Florida"
        ],
        "rmse": 9068.541185,
        "r2": 0.935696,
        "mae": 7431.47327,
        "train_rmse": 9036.510816
      },
      {
        "features": [
          "R&D Spend",
          "Administration",
          "Marketing Spend",
          "State_Florida",
          "State_New York"
        ],
        "rmse": 9137.990153,
        "r2": 0.934707,
        "mae": 7514.29366,
        "train_rmse": 9031.666613
      }
    ]
  }
};
