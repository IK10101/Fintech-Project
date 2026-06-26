# 💰 Fintech Backend API

A production-ready REST API for a digital wallet system built with Node.js, Express, and MongoDB.

## 🚀 Features

- JWT Authentication (register, login, protected routes)
- Digital Wallet (deposit, withdraw, transfer between users)
- Transaction Logging with pagination and filtering
- Atomic Transfers using MongoDB sessions
- Spending Reports with MongoDB Aggregation Pipeline
- Input Validation with express-validator
- Rate Limiting and Global Error Handling

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **Validation:** express-validator
- **Security:** express-rate-limit

## ⚙️ Setup

```bash
# Clone the repo
git clone https://github.com/IK10101/Fintech-Project.git

# Install dependencies
npm install

# Create .env file
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000

# Start server
node server.js
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | ❌ |
| POST | /api/auth/login | Login user | ❌ |
| GET | /api/auth/me | Get current user | ✅ |

### Wallet
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/wallet/balance | Get balance | ✅ |
| POST | /api/wallet/deposit | Deposit money | ✅ |
| POST | /api/wallet/withdraw | Withdraw money | ✅ |
| POST | /api/wallet/transfer | Transfer to user | ✅ |

### Transactions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/transactions/add | Log transaction | ✅ |
| GET | /api/transactions | Get history | ✅ |

### Reports
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/reports/summary | Monthly summary | ✅ |
| GET | /api/reports/category-breakdown | Spending by category | ✅ |
| GET | /api/reports/balance-history | Balance over time | ✅ |

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 💡 Key Concepts Implemented

- **Atomic Transfers** — MongoDB sessions ensure money is never lost
- **Event Sourcing** — Every balance change is logged with balanceAfter snapshot
- **Service Layer** — Business logic separated from route handlers
- **Pagination** — All list endpoints support page and limit params