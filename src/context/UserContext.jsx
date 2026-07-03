import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const defaultUser = {
  connected: false,
  username: "Guedes",
  id: "Aguardando conexão",
  avatar: null,
  plan: "Premium",
  license: "Licença ativa",
  version: "..."
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("discordUser");
    return saved ? { ...defaultUser, ...JSON.parse(saved) } : defaultUser;
  });

  useEffect(() => {
    window.optimizer.getAppVersion().then((version) => {
      setUser((prev) => ({ ...prev, version }));
    });
  }, []);

  async function connectDiscord(notify) {
    const discord = await window.optimizer.connectDiscord();

    const updatedUser = {
      ...user,
      connected: true,
      username: discord.username,
      id: discord.id,
      avatar: discord.avatar
    };

    localStorage.setItem("discordUser", JSON.stringify(updatedUser));
    setUser(updatedUser);

    notify?.("Discord conectado", `Bem-vindo, ${discord.username}.`);
  }

  function disconnectDiscord(notify) {
    localStorage.removeItem("discordUser");

    setUser((prev) => ({
      ...defaultUser,
      version: prev.version
    }));

    notify?.("Discord", "Conta desconectada.");
  }

  return (
    <UserContext.Provider value={{ user, connectDiscord, disconnectDiscord }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}