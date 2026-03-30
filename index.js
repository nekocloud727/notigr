const { Telegraf } = require('telegraf');
const express = require('express');
const BOT_TOKEN = "8789804595:AAG3SXRyHWwYMcbA9d86YuXEmzrbEx2YYVI";
const GROUP_ID = "-1003718219553";
if (!BOT_TOKEN || !GROUP_ID) {
    console.error('❌ Thiếu BOT_TOKEN hoặc GROUP_ID');
    process.exit(1);
}


const bot = new Telegraf(BOT_TOKEN);

// ================= RANDOM =================

// Random user dạng 7 số + *****
const randomUser = () => {
    const prefix = Math.floor(1000000 + Math.random() * 9000000);
    return `${prefix}*****`;
};

// Random tiền nạp
const getRandomDeposit = () => {
    const amounts = [50000, 100000, 150000, 200000, 250000, 300000];
    return amounts[Math.floor(Math.random() * amounts.length)];
};

// Random tiền rút
const getRandomWithdraw = () => {
    const amounts = [50000, 100000, 200000];
    return amounts[Math.floor(Math.random() * amounts.length)];
};

// Format tiền VNĐ
const formatMoney = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
};

// ================= SEND MESSAGE =================

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

        console.log('📤 Đang gửi:', text);

        const res = await bot.telegram.sendMessage(GROUP_ID, text);

        console.log('✅ Gửi thành công. Message ID:', res.message_id);

    } catch (error) {
        console.error('❌ Lỗi gửi message:', error.response?.description || error.message);
    }
};

// ================= LOOP =================

const startRandomLoop = () => {
    console.log('🔁 Bắt đầu vòng lặp...');

    const loop = async () => {
        const delay = Math.floor(Math.random() * 20000) + 10000; // 10s → 30s

        console.log(`⏳ Chờ ${delay / 1000}s`);

        setTimeout(async () => {
            await sendFakeMessage();
            loop();
        }, delay);
    };

    loop();
};

// ================= START =================

(async () => {
    try {
        await bot.launch();
        console.log('🤖 Bot đã khởi động thành công');

        startRandomLoop();

    } catch (err) {
        console.error('❌ Lỗi khởi động bot:', err.message);
    }
})();

// ================= STOP =================

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/cron', async (req, res) => {
    try {
        console.log(`Cron đã chạy lúc: ${new Date().toLocaleString()}`);
        return res.status(200).json({
            status: "ok",
            message: "Cron job executed"
        });
    } catch (err) {
        console.error("Lỗi cron:", err);
        return res.status(500).json({
            status: "error"
        });
    }
});

process.once('SIGINT', () => {
    console.log('🛑 Dừng bot SIGINT');
    bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
    console.log('🛑 Dừng bot SIGTERM');
    bot.stop('SIGTERM');
});
