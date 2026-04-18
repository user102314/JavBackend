#!/usr/bin/env bash
# One-time VPS setup. Run as user `ubuntu` on 57.129.42.159.
# Usage:  bash vps-setup.sh
set -euo pipefail

REPO_URL="https://github.com/user102314/JavBackend.git"
APP_DIR="$HOME/JavBackend"

echo "==> Installing prerequisites"
sudo apt-get update
sudo apt-get install -y git openjdk-21-jdk maven ufw

echo "==> Cloning repo (if missing)"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone "$REPO_URL" "$APP_DIR"
fi

echo "==> Installing systemd user service"
mkdir -p "$HOME/.config/systemd/user"
cp "$APP_DIR/deploy/javbackend.service" "$HOME/.config/systemd/user/javbackend.service"

echo "==> Enabling linger so user services run without login"
sudo loginctl enable-linger "$USER"

echo "==> First build"
cd "$APP_DIR"
chmod +x mvnw 2>/dev/null || true
if [ -x ./mvnw ]; then ./mvnw -B -DskipTests clean package; else mvn -B -DskipTests clean package; fi

echo "==> Starting service"
systemctl --user daemon-reload
systemctl --user enable javbackend
systemctl --user restart javbackend

echo "==> Opening firewall for Spring Boot (8080) and SSH"
sudo ufw allow OpenSSH || true
sudo ufw allow 8080/tcp || true
sudo ufw --force enable || true

echo "==> Done. Status:"
systemctl --user --no-pager status javbackend | head -20

echo
echo "----- NEXT: create deploy SSH key -----"
if [ ! -f "$HOME/.ssh/github_deploy" ]; then
  ssh-keygen -t ed25519 -N "" -f "$HOME/.ssh/github_deploy" -C "github-actions-deploy"
  cat "$HOME/.ssh/github_deploy.pub" >> "$HOME/.ssh/authorized_keys"
  chmod 600 "$HOME/.ssh/authorized_keys"
fi
echo
echo "Copy the PRIVATE key below into GitHub Secret  VPS_SSH_KEY :"
echo "------------------------------------------------------------"
cat "$HOME/.ssh/github_deploy"
echo "------------------------------------------------------------"
