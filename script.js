// --- INR Formatter (Indian Numbering System) ---
const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
});

// --- State Management ---
const stateManager = {
    // Starts at zero/empty initially
    transactions: JSON.parse(localStorage.getItem("nexus_inr_data")) || [],
    role: 'admin',
    charts: { line: null, pie: null },

    save() {
        localStorage.setItem("nexus_inr_data", JSON.stringify(this.transactions));
        this.render();
    },

    updateRole(newRole) {
        this.role = newRole;
        document.getElementById('adminForm').style.display = newRole === 'admin' ? 'block' : 'none';
        this.render();
    },

    render() {
        this.updateSummary();
        this.renderTable();
        this.updateCharts();
        this.generateInsights();
    },

    updateSummary() {
        const income = this.transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
        const expense = this.transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

        document.getElementById("balanceDisplay").innerText = inrFormatter.format(income - expense);
        document.getElementById("incomeDisplay").innerText = inrFormatter.format(income);
        document.getElementById("expenseDisplay").innerText = inrFormatter.format(expense);
    },

    renderTable() {
        const search = document.getElementById("search").value.toLowerCase();
        const filter = document.getElementById("filterType").value;
        const tbody = document.getElementById("tbody");

        const filtered = this.transactions.filter(t =>
            (t.name.toLowerCase().includes(search) || t.category.toLowerCase().includes(search)) &&
            (filter === '' || t.type === filter)
        ).sort((a, b) => new Date(b.date) - new Date(a.date));

        tbody.innerHTML = filtered.map((t) => {
            const globalIndex = this.transactions.indexOf(t);
            return `
                    <tr>
                        <td>${t.date}</td>
                        <td style="font-weight:600">${t.name}</td>
                        <td><span style="color:var(--text-muted)">${t.category}</span></td>
                        <td style="font-weight:bold; color:${t.type === 'income' ? 'var(--success)' : 'var(--danger)'}">
                            ${inrFormatter.format(t.amount)}
                        </td>
                        <td><span class="badge badge-${t.type}">${t.type}</span></td>
                        <td>
                            ${this.role === 'admin' ? `
                                <button class="danger" onclick="deleteTransaction(${globalIndex})">Delete</button>
                            ` : '🔒'}
                        </td>
                    </tr>
                `;
        }).join('');
    },

    updateCharts() {
        const ctxLine = document.getElementById('lineChart').getContext('2d');
        const ctxPie = document.getElementById('pieChart').getContext('2d');

        const timeline = {};
        const categories = {};

        this.transactions.forEach(t => {
            timeline[t.date] = (timeline[t.date] || 0) + (t.type === 'income' ? t.amount : -t.amount);
            if (t.type === 'expense') categories[t.category] = (categories[t.category] || 0) + t.amount;
        });

        if (this.charts.line) this.charts.line.destroy();
        if (this.charts.pie) this.charts.pie.destroy();

        this.charts.line = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: Object.keys(timeline).sort(),
                datasets: [{
                    label: 'Balance (₹)',
                    data: Object.keys(timeline).sort().map(k => timeline[k]),
                    borderColor: '#4f46e5',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.1)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        this.charts.pie = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    },

    generateInsights() {
        if (!this.transactions.length) return;
        const expenses = this.transactions.filter(t => t.type === 'expense');
        if (!expenses.length) {
            document.getElementById('insight-summary').innerText = "Status: Saving 100% of income.";
            return;
        }
        const catTotals = {};
        expenses.forEach(e => catTotals[e.category] = (catTotals[e.category] || 0) + e.amount);
        const topCat = Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b);
        document.getElementById('insight-summary').innerText = `Insight: Your top expense is "${topCat}".`;
    }
};

// --- Actions ---
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

function addTransaction() {
    const n = document.getElementById("name");
    const a = document.getElementById("amount");
    const ty = document.getElementById("type");
    const c = document.getElementById("category");
    const d = document.getElementById("date");

    if (!n.value || !a.value || !d.value) {
        alert("Fill Description, Amount and Date");
        return;
    }

    stateManager.transactions.push({
        name: n.value,
        amount: parseFloat(a.value),
        type: ty.value,
        category: c.value || 'General',
        date: d.value
    });

    stateManager.save();
    showToast("Transaction Recorded");

    n.value = ''; a.value = '';
}

function deleteTransaction(index) {
    if (confirm("Delete this record?")) {
        stateManager.transactions.splice(index, 1);
        stateManager.save();
        showToast("Record Removed");
    }
}

function toggleDark() { document.getElementById('mainBody').classList.toggle('dark'); }

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stateManager.transactions));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "finance_export_inr.json");
    dlAnchorElem.click();
}

// Set default date to today
document.getElementById('date').valueAsDate = new Date();

// Initial render
stateManager.render();