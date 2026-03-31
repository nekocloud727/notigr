const { Telegraf } = require('telegraf');
const express = require('express');

// ====== CONFIG ======
const BOT_TOKEN = "8789804595:AAG3SXRyHWwYMcbA9d86YuXEmzrbEx2YYVI";
const GROUP_ID = "-1003718219553";

// ====== CHECK ======
if (!BOT_TOKEN || !GROUP_ID) {
    console.error('❌ Thiếu BOT_TOKEN hoặc GROUP_ID');
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// ====== RANDOM ======
const randomUser = () => {
    const prefix = Math.floor(1000000 + Math.random() * 9000000);
    return `${prefix}*****`;
};

const getRandomDeposit = () => {
    const arr = [50000, 80000, 100000, 150000, 200000, 500000];
    return arr[Math.floor(Math.random() * arr.length)];
};

const getRandomWithdraw = () => {
    const arr = [50000, 100000, 200000];
    return arr[Math.floor(Math.random() * arr.length)];
};

const formatMoney = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
};

// ====== SEND FAKE ======
const sendFakeMessage = async () => {
    try {
        const isWithdraw = Math.random() > 0.5;
        const user = randomUser();

        let text;

        if (isWithdraw) {
            const amount = getRandomWithdraw();
            text = `💸 ${user} VỪA RÚT TIỀN THÀNH CÔNG - ${formatMoney(amount)}đ`;
        } else {
            const amount = getRandomDeposit();
            text = `💰 ${user} NẠP TIỀN THÀNH CÔNG - ${formatMoney(amount)}đ`;
        }

        console.log('📤 Gửi:', text);

        await bot.telegram.sendMessage(GROUP_ID, text);

    } catch (err) {
        console.error('❌ Lỗi:', err.response?.description || err.message);
    }
};

// ====== LOOP ======
const startLoop = () => {
    console.log('🔁 Loop bắt đầu');

    const loop = () => {
        const delay = Math.floor(Math.random() * 20000) + 10000;

        setTimeout(async () => {
            await sendFakeMessage();
            loop();
        }, delay);
    };

    loop();
};

// ====== EXPRESS ======
app.get('/', (req, res) => {
    res.send('Bot đang chạy ✅');
});

app.get('/cron', (req, res) => {
    console.log('Cron chạy:', new Date().toLocaleString());
    res.json({ ok: true });
});

// ====== LISTEN (QUAN TRỌNG) ======
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🌐 Server chạy port ${PORT}`);
});

// ====== START BOT ======
(async () => {
    try {
        await bot.launch();
        console.log('🤖 Bot chạy OK');

        startLoop();

    } catch (err) {
        console.error('❌ Lỗi bot:', err.message);
    }
})();

// ====== STOP ======
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
