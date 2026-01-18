#!/data/data/com.termux/files/usr/bin/bash
# ==============================================
# 🚀 إعداد Git لمشروع مع حماية الملفات الكبيرة ونسخ احتياطي
# ==============================================

# ----- 1️⃣ تثبيت Git LFS إذا لم يكن موجودًا -----
if ! command -v git-lfs >/dev/null 2>&1; then
    echo -e "\e[33m⚡ تثبيت Git LFS...\e[0m"
    pkg install -y git-lfs
    git lfs install
fi

# ----- 2️⃣ إعداد Git LFS لتتبع الملفات الكبيرة -----
# يمكنك تعديل الامتدادات حسب حاجتك
git lfs track "*.zip" "*.tgz" "*.bin" "*.mp4" "*.mov"
git add .gitattributes
git commit -m "Configure Git LFS for large files" 2>/dev/null || true

# ----- 3️⃣ إنشاء pre-commit hook لمنع الملفات الكبيرة -----
HOOK_DIR=".git/hooks"
mkdir -p "$HOOK_DIR"
cat > "$HOOK_DIR/pre-commit" << 'EOF'
#!/bin/bash
# منع الملفات >10MB من الالتزام
max_size=10485760
files=$(git diff --cached --name-only)

for f in $files; do
    if [ -f "$f" ]; then
        size=$(stat -c%s "$f" 2>/dev/null || stat -f%z "$f")
        if [ $size -gt $max_size ]; then
            echo "❌ الملف $f أكبر من 10MB، لا يمكن الالتزام به."
            exit 1
        fi
    fi
done
EOF
chmod +x "$HOOK_DIR/pre-commit"

# ----- 4️⃣ إعداد مجلد النسخ الاحتياطي -----
BACKUP_DIR=~/Backups/configs
mkdir -p "$BACKUP_DIR"

# ----- 5️⃣ نسخ احتياطي للملفات المهمة من المشروع الحالي -----
shopt -s globstar

for f in **/*; do
    if [[ -f "$f" && ( "$f" == *.env || "$f" == *.json || "$f" == *.yaml || "$f" == *.yml || "$f" == *.config ) ]]; then
        DEST="$BACKUP_DIR/$(basename $(pwd))"
        mkdir -p "$DEST"
        cp -u "$f" "$DEST/"
    fi
done

echo -e "\e[32m✅ Git LFS مفعل، hook منع الملفات الكبيرة جاهز، وتم نسخ ملفات التكوين إلى $BACKUP_DIR\e[0m"


