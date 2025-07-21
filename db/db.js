
const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://admin:admin@admin.qboa2og.mongodb.net/color'; // hoặc URL Atlas

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Đã kết nối MongoDB thành công!');
  } catch (err) {
    console.error('❌ Kết nối MongoDB thất bại:', err);
    process.exit(1); // Thoát chương trình nếu lỗi
  }
};

module.exports = connectDB;
