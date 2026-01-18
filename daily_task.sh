#!/bin/bash

# ملف حفظ اليوم الحالي
DAY_FILE="$HOME/.daily_task_day"
TOTAL_DAYS=14

# قراءة اليوم الحالي أو البدء باليوم 1
if [ -f "$DAY_FILE" ]; then
    DAY=$(cat "$DAY_FILE")
else
    DAY=1
fi

# قائمة المهام اليومية
TASKS=(
    "تنظيف الملفات المؤقتة (.save)"
    "تثبيت الحزم في frontend/backend"
    "إنشاء .env وتشغيل start.sh"
    "نسخ ملفات wallet-ui للـ frontend"
    "تشغيل backend"
    "اختبار wallets عبر المتصفح"
    "تحرير run.sh وتشغيله"
    "تحرير App.jsx وإضافة أيقونات Loader"
    "تشغيل ngrok وجمع الملاحظات"
    "تعديل الأكواد حسب الملاحظات"
    "تقليل حجم JS/CSS واختبار caching"
    "نشر على Vercel/Cloudflare"
    "تحديث README.md وملفات التوثيق"
    "إطلاق النسخة التجريبية"
)

# عرض المهمة اليومية
echo "📅 اليوم: $DAY/$TOTAL_DAYS"
echo "📝 المهمة اليومية:"
echo "   ${TASKS[$((DAY-1))]}"

# النسخ الاحتياطي اليومي قبل تنفيذ المهمة
BACKUP_DIR="$HOME/Backups"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%F)_DAY$DAY.tar.gz"

echo "📦 إنشاء نسخة احتياطية للمشاريع..."
tar -czf "$BACKUP_FILE" -C "$HOME" \
    onchain-wallet-verifier coingecko-api wallet-ui wallet-verifier-go my-app my-onchainkit-app projects
echo "✅ النسخة الاحتياطية جاهزة: $BACKUP_FILE"

# تنفيذ أوامر اليوم تلقائيًا
case $DAY in
1)
    echo "🔹 تنظيف الملفات المؤقتة"
    cd ~/onchain-wallet-verifier && find . -name '*.save' -delete
    ;;
2)
    echo "🔹 تثبيت الحزم"
    cd ~/onchain-wallet-verifier/frontend && npm install
    cd ~/onchain-wallet-verifier/backend && npm install
    ;;
3)
    echo "🔹 إعداد البيئة وتشغيل start.sh"
    cd ~/onchain-wallet-verifier
    cp .env.example .env
    chmod +x start.sh
    ./start.sh
    ;;
4)
    echo "🔹 نسخ ملفات wallet-ui للـ frontend"
    cp -r ~/wallet-ui/* ~/onchain-wallet-verifier/frontend/src/
    ;;
5)
    echo "🔹 تشغيل backend"
    cd ~/onchain-wallet-verifier/backend && node index.js
    ;;
6)
    echo "🔹 اختبار wallets عبر المتصفح"
    echo "افتح http://localhost:PORT وجرب test wallets"
    ;;
7)
    echo "🔹 تحرير وتشغيل run.sh"
    nano ~/onchain-wallet-verifier/run.sh
    chmod +x ~/onchain-wallet-verifier/run.sh
    ~/onchain-wallet-verifier/run.sh
    ;;
8)
    echo "🔹 تعديل App.jsx وإضافة أيقونات Loader"
    nano ~/onchain-wallet-verifier/frontend/src/App.jsx
    ;;
9)
    echo "🔹 تشغيل ngrok وجمع الملاحظات"
    ./ngrok http PORT
    ;;
10)
    echo "🔹 تعديل الأكواد حسب الملاحظات"
    git add .
    git commit -m "Fixes"
    ;;
11)
    echo "🔹 تقليل حجم JS/CSS واختبار caching"
    ;;
12)
    echo "🔹 نشر على Vercel/Cloudflare"
    ;;
13)
    echo "🔹 تحديث README.md والتوثيق"
    ;;
14)
    echo "🔹 إطلاق النسخة التجريبية رسميًا"
    ;;
esac

# زيادة اليوم تلقائيًا
if [ $DAY -lt $TOTAL_DAYS ]; then
    echo $((DAY+1)) > "$DAY_FILE"
else
    echo $TOTAL_DAYS > "$DAY_FILE"
fi

echo "✅ المهمة اليومية اكتملت!"

