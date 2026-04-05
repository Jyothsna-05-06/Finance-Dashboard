💰 **Finance Dashboard**

📌 **Overview**

Finance Dashboard is a web-based personal finance application built using HTML, CSS, and JavaScript. It helps users manage income and expenses efficiently with real-time updates, interactive charts, and Indian Rupee (₹) formatting.

🧩 **Key Functionalities**

1. Transaction Management

- Users can add transactions with:
  - Description
  - Amount
  - Type (Income/Expense)
  - Category
  - Date
- Transactions are stored in browser LocalStorage.
- Admin users can delete transactions.

2. Role-Based Access Control (RBAC)

- Admin:
  - Add/Delete transactions
- Viewer:
  - Read-only access
  - Cannot modify data

💾 **Data Storage**

- Uses LocalStorage
- Key: "nexus_inr_data"
- Stores transactions as JSON array

💱 **Currency Formatting**

- Uses "Intl.NumberFormat('en-IN')"
- Displays values in Indian format:
  - Example: ₹1,00,000 instead of ₹100,000

📊 **Charts (Chart.js)**

Line Chart

- Displays daily balance trend
- Income adds (+), Expense subtracts (-)

Pie Chart

- Displays expense distribution by category

🧠 **State Management**

stateManager Object

Central controller of the application:

- "transactions" → stores all data
- "role" → current user role
- "charts" → chart instances

Methods:

- "save()" → saves to LocalStorage + re-render
- "render()" → updates UI
- "updateSummary()" → updates totals
- "renderTable()" → displays transactions
- "updateCharts()" → updates charts
- "generateInsights()" → shows spending insights

🔍 **Filtering & Search**

- Search by description or category
- Filter by:
  - Income
  - Expense
- Sorted by latest date

🎨 **UI Features**

- Responsive layout using CSS Grid
- Dark mode toggle 🌙
- Toast notifications
- Styled cards and tables
- Color-coded income/expense

⚠️ **Validations & Edge Cases**

- Prevent empty inputs
- Default category = "General"
- Confirmation before delete
- Handles empty dataset
- Viewer cannot edit/delete


📤 **Export Feature**

- Exports transactions as ".json" file
- Uses data URI encoding

🧾 **Code Structure**

HTML

- Layout (cards, form, table, charts)

CSS

- Variables for theming
- Responsive design
- Dark mode support

JavaScript

- State management
- DOM updates
- Chart integration
- Event handling

🔄 **Workflow**

1. User enters transaction
2. "addTransaction()" is triggered
3. Data is added to stateManager
4. Saved in LocalStorage
5. UI and charts are updated

📱 **Responsiveness**

- Works on desktop, tablet, and mobile
- Layout adjusts automatically

✨ **Insights Feature**

- Detects highest expense category
- Displays smart message

📌 **Conclusion**

This project demonstrates strong frontend development, efficient state management, real-time UI updates, and a clean responsive design.