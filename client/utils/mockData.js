// In-memory mock backend used when NEXT_PUBLIC_DEMO_MODE === "true".
// It lets the entire UI run and be exercised without a live API server.

const STORAGE_KEY = "cbdc_demo_state";

const seedState = () => ({
  users: [
    {
      id: "u_admin",
      name: "Central Admin",
      email: "admin@cbdc.gov",
      password: "admin123",
      role: "admin",
      walletAddress: "0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0",
      balance: 0,
      kycStatus: "verified",
    },
    {
      id: "u_demo",
      name: "Demo Citizen",
      email: "demo@cbdc.gov",
      password: "demo123",
      role: "citizen",
      walletAddress: "0x9f8E7d6C5b4A39281706f5E4d3C2b1A09f8E7d6C",
      balance: 12450.75,
      kycStatus: "verified",
    },
  ],
  transactions: [
    {
      id: "t1",
      from: "0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0",
      to: "0x9f8E7d6C5b4A39281706f5E4d3C2b1A09f8E7d6C",
      amount: 5000,
      type: "mint",
      status: "completed",
      txHash: "0xab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      note: "Initial allocation",
    },
    {
      id: "t2",
      from: "0x9f8E7d6C5b4A39281706f5E4d3C2b1A09f8E7d6C",
      to: "0x5512Ab90Cd34Ef78901234567890Abcd1234Ef56",
      amount: 250.5,
      type: "transfer",
      status: "completed",
      txHash: "0xcd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      note: "Groceries",
    },
    {
      id: "t3",
      from: "0x9f8E7d6C5b4A39281706f5E4d3C2b1A09f8E7d6C",
      to: "0x77a1B2c3D4e5F6a7B8c9D0e1F2a3B4c5D6e7F8a9",
      amount: 1200,
      type: "transfer",
      status: "pending",
      txHash: "0xef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56ab12cd34ef56",
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      note: "Rent",
    },
  ],
});

function randomHex(len) {
  const chars = "0123456789abcdef";
  let out = "0x";
  for (let i = 0; i < len; i += 1) out += chars[Math.floor(Math.random() * 16)];
  return out;
}

function loadState() {
  if (typeof window === "undefined") return seedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return seedState();
  }
}

function saveState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

function sanitize(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

export const mockApi = {
  async register({ name, email, password, role = "citizen" }) {
    await delay();
    const state = loadState();
    if (state.users.some((u) => u.email === email)) {
      throw { response: { data: { message: "Email already registered" } } };
    }
    const user = {
      id: `u_${Date.now()}`,
      name,
      email,
      password,
      role,
      walletAddress: randomHex(40),
      balance: 0,
      kycStatus: "pending",
    };
    state.users.push(user);
    saveState(state);
    return { token: `demo-token-${user.id}`, user: sanitize(user) };
  },

  async login({ email, password }) {
    await delay();
    const state = loadState();
    const user = state.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw { response: { data: { message: "Invalid email or password" } } };
    }
    return { token: `demo-token-${user.id}`, user: sanitize(user) };
  },

  async getProfile(userId) {
    await delay(200);
    const state = loadState();
    const user = state.users.find((u) => u.id === userId);
    if (!user) throw { response: { data: { message: "User not found" } } };
    return sanitize(user);
  },

  async transfer(userId, { to, amount, note }) {
    await delay();
    const state = loadState();
    const user = state.users.find((u) => u.id === userId);
    if (!user) throw { response: { data: { message: "User not found" } } };
    const value = Number(amount);
    if (!to) throw { response: { data: { message: "Recipient is required" } } };
    if (!value || value <= 0) {
      throw { response: { data: { message: "Amount must be greater than 0" } } };
    }
    if (value > user.balance) {
      throw { response: { data: { message: "Insufficient balance" } } };
    }
    user.balance -= value;
    const tx = {
      id: `t_${Date.now()}`,
      from: user.walletAddress,
      to,
      amount: value,
      type: "transfer",
      status: "completed",
      txHash: randomHex(64),
      createdAt: new Date().toISOString(),
      note: note || "",
    };
    state.transactions.unshift(tx);
    saveState(state);
    return { transaction: tx, balance: user.balance };
  },

  async getTransactions(userId) {
    await delay(200);
    const state = loadState();
    const user = state.users.find((u) => u.id === userId);
    if (!user) return [];
    return state.transactions
      .filter((t) => t.from === user.walletAddress || t.to === user.walletAddress)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async submitKyc(userId) {
    await delay();
    const state = loadState();
    const user = state.users.find((u) => u.id === userId);
    if (!user) throw { response: { data: { message: "User not found" } } };
    user.kycStatus = "submitted";
    saveState(state);
    return { kycStatus: user.kycStatus };
  },

  async mint(_userId, { to, amount }) {
    await delay();
    const state = loadState();
    const value = Number(amount);
    if (!value || value <= 0) {
      throw { response: { data: { message: "Amount must be greater than 0" } } };
    }
    const target = state.users.find((u) => u.walletAddress === to);
    if (target) target.balance += value;
    const tx = {
      id: `t_${Date.now()}`,
      from: "0x0000000000000000000000000000000000000000",
      to,
      amount: value,
      type: "mint",
      status: "completed",
      txHash: randomHex(64),
      createdAt: new Date().toISOString(),
      note: "Minted by central bank",
    };
    state.transactions.unshift(tx);
    saveState(state);
    return { transaction: tx };
  },

  async burn(_userId, { from, amount }) {
    await delay();
    const state = loadState();
    const value = Number(amount);
    if (!value || value <= 0) {
      throw { response: { data: { message: "Amount must be greater than 0" } } };
    }
    const target = state.users.find((u) => u.walletAddress === from);
    if (target) target.balance = Math.max(0, target.balance - value);
    const tx = {
      id: `t_${Date.now()}`,
      from,
      to: "0x0000000000000000000000000000000000000000",
      amount: value,
      type: "burn",
      status: "completed",
      txHash: randomHex(64),
      createdAt: new Date().toISOString(),
      note: "Burned by central bank",
    };
    state.transactions.unshift(tx);
    saveState(state);
    return { transaction: tx };
  },

  async getAdminStats() {
    await delay(200);
    const state = loadState();
    const totalSupply = state.users.reduce((sum, u) => sum + u.balance, 0);
    const completed = state.transactions.filter((t) => t.status === "completed");
    const pending = state.transactions.filter((t) => t.status === "pending");
    const volume = completed.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalSupply,
      totalUsers: state.users.length,
      totalTransactions: state.transactions.length,
      pendingTransactions: pending.length,
      transactionVolume: volume,
      users: state.users.map(sanitize),
    };
  },

  reset() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};

export function demoUserIdFromToken(token) {
  if (!token || !token.startsWith("demo-token-")) return null;
  return token.replace("demo-token-", "");
}
