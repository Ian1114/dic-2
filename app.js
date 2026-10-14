(() => {
  "use strict";

  const data = window.RESULTS_DATA;
  if (!data || !data.methods) {
    document.body.insertAdjacentHTML("afterbegin", '<p role="alert">找不到模型資料，請重新執行 generate_data.py。</p>');
    return;
  }

  const names = {
    lasso: "Lasso",
    forward: "Forward SFS",
    rfe: "RFE",
    elasticnet: "ElasticNet",
    exhaustive: "Exhaustive Search",
  };
  const notes = {
    lasso: "Lasso 以標準化後的 L1 係數大小排序，再用所選欄位重新擬合一般線性迴歸。",
    forward: "Forward SFS 在訓練資料中使用 5 折交叉驗證，逐步尋找較低 RMSE 的欄位組合。",
    rfe: "RFE 從完整模型開始，逐步剔除影響較小的欄位。",
    elasticnet: "ElasticNet 結合 L1 與 L2 正則化，依標準化後的係數大小排序。",
    exhaustive: "Exhaustive Search 比較該 k 值的所有欄位組合，以訓練資料的 5 折交叉驗證選出最佳子集。",
  };
  const state = { method: "lasso", k: 4 };
  const currency = value => "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const score = value => value.toFixed(4);
  const $ = id => document.getElementById(id);

  function renderChart(target, key, color, title) {
    const rows = data.methods[state.method];
    const values = rows.map(row => row[key]);
    const low = Math.min(...values);
    const high = Math.max(...values);
    const spread = Math.max(high - low, key === "r2" ? 0.005 : 100);
    const min = low - spread * 0.12;
    const max = high + spread * 0.12;
    const left = 68, right = 565, top = 30, bottom = 262;
    const x = index => left + index * (right - left) / 4;
    const y = value => bottom - (value - min) / (max - min) * (bottom - top);
    const tickLabel = value => key === "r2" ? value.toFixed(3) : Math.round(value).toLocaleString("en-US");
    const pointLabel = value => key === "r2" ? value.toFixed(4) : "$" + Math.round(value).toLocaleString("en-US");
    const grid = Array.from({ length: 5 }, (_, i) => {
      const py = top + i * (bottom - top) / 4;
      const value = max - i * (max - min) / 4;
      return `<line x1="${left}" x2="${right}" y1="${py}" y2="${py}" stroke="#e9edf5" stroke-width="1"/><text x="${left - 12}" y="${py + 4}" text-anchor="end" fill="#8792a6" font-size="12">${tickLabel(value)}</text>`;
    }).join("");
    const points = values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
    const dots = values.map((value, index) => {
      const selected = index + 1 === state.k;
      return `<g data-k="${index + 1}" tabindex="0" role="button" aria-label="選擇 k = ${index + 1}"><circle cx="${x(index)}" cy="${y(value)}" r="${selected ? 9 : 6}" fill="${color}" stroke="#fff" stroke-width="3"/><circle cx="${x(index)}" cy="${y(value)}" r="16" fill="transparent"/><title>k = ${index + 1}: ${pointLabel(value)}</title></g>`;
    }).join("");
    const current = values[state.k - 1];
    const currentX = x(state.k - 1), currentY = y(current);
    const labelY = Math.max(18, currentY - 16);
    const xLabels = values.map((_, index) => `<text x="${x(index)}" y="${bottom + 25}" text-anchor="middle" fill="#65718a" font-size="12">${index + 1}</text>`).join("");
    $(target).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 315" role="img" aria-label="${title}，目前 k = ${state.k}，數值 ${pointLabel(current)}"><rect width="600" height="315" fill="#fff"/>${grid}<line x1="${currentX}" x2="${currentX}" y1="${top}" y2="${bottom}" stroke="${color}" stroke-width="1" stroke-dasharray="4 5" opacity=".4"/><polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${dots}<text x="${currentX}" y="${labelY}" text-anchor="middle" fill="${color}" font-size="13" font-weight="700">${pointLabel(current)}</text>${xLabels}<text x="316" y="306" text-anchor="middle" fill="#6a7790" font-size="12">Number of Features (k)</text></svg>`;
    $(target).querySelectorAll("[data-k]").forEach(node => {
      const select = () => { state.k = Number(node.dataset.k); render(); };
      node.addEventListener("click", select);
      node.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); }
      });
    });
  }

  function renderTable(rows) {
    const tbody = $("results-body");
    tbody.replaceChildren();
    rows.forEach((row, index) => {
      const tr = document.createElement("tr");
      if (index + 1 === state.k) tr.className = "active";
      const values = [String(index + 1), row.features.join(" · "), currency(row.rmse), score(row.r2), currency(row.mae)];
      values.forEach(value => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.append(td);
      });
      tr.addEventListener("click", () => { state.k = index + 1; render(); });
      tbody.append(tr);
    });
  }

  function render() {
    const rows = data.methods[state.method];
    const row = rows[state.k - 1];
    document.querySelectorAll("#algorithm-controls button").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.method === state.method)));
    document.querySelectorAll("#k-controls button").forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.k) === state.k)));
    $("selection-label").textContent = `${names[state.method]}  /  k = ${state.k}`;
    $("metric-rmse").textContent = currency(row.rmse);
    $("metric-r2").textContent = score(row.r2);
    $("metric-mae").textContent = currency(row.mae);
    $("feature-count").textContent = `(${row.features.length})`;
    $("method-note").textContent = notes[state.method];
    const chips = $("feature-chips");
    chips.replaceChildren();
    row.features.forEach(feature => {
      const chip = document.createElement("span");
      chip.textContent = feature;
      chips.append(chip);
    });
    renderChart("rmse-chart", "rmse", "#10aa8e", "RMSE by Number of Features");
    renderChart("r2-chart", "r2", "#5749cf", "R-squared by Number of Features");
    renderTable(rows);
  }

  async function downloadCharts() {
    const button = $("download-btn");
    button.disabled = true;
    button.textContent = "正在製作 PNG…";
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1800;
      canvas.height = 590;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#18234a";
      context.font = "bold 30px Arial";
      context.fillText(`50 Startups · ${names[state.method]} · k = ${state.k}`, 48, 58);
      const containers = [$("rmse-chart"), $("r2-chart")];
      for (let i = 0; i < containers.length; i++) {
        const svg = containers[i].querySelector("svg");
        const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        try {
          const image = new Image();
          image.src = url;
          await image.decode();
          context.fillStyle = "#27324f";
          context.font = "bold 22px Arial";
          context.fillText(i === 0 ? "RMSE by Number of Features" : "R-squared by Number of Features", 48 + i * 875, 105);
          context.drawImage(image, 30 + i * 875, 120, 855, 450);
        } finally {
          URL.revokeObjectURL(url);
        }
      }
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `50-startups-${state.method}-k${state.k}.png`;
      link.click();
    } catch (error) {
      console.error(error);
      button.textContent = "下載失敗，請重試";
      return;
    } finally {
      button.disabled = false;
      if (button.textContent !== "下載失敗，請重試") button.textContent = "下載目前圖表 PNG ↓";
    }
  }

  document.querySelectorAll("#algorithm-controls button").forEach(button => button.addEventListener("click", () => { state.method = button.dataset.method; render(); }));
  document.querySelectorAll("#k-controls button").forEach(button => button.addEventListener("click", () => { state.k = Number(button.dataset.k); render(); }));
  $("download-btn").addEventListener("click", downloadCharts);
  render();
})();
