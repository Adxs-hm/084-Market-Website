
// This file acts as the database for the 084 Mall.
// To save changes permanently:
// 1. Edit in the Admin Panel
// 2. Click "Save & Export"
// 3. Overwrite this file with the downloaded one.

window.MALL_DATA = {
    // 1. System Config (Marquee, Carousel, Music, Ads)
    config: {
        marquee: "欢迎光临零八四商城！本商城与卡戎快运 (Charon Express) 达成战略合作，全场包邮，极速送达！",
        slides: [
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80"
        ],
        slideCaptions: [
            { title: "084 商城盛大开业", desc: "全场商品 5 折起，卡戎快运免费包邮！" },
            { title: "夏季数码狂欢节", desc: "最新款手机、笔记本电脑，现货极速发。" },
            { title: "品质家居生活指南", desc: "精选全球好物，打造您的温馨港湾。" }
        ],
        bgMusic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        adGif: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80", 
        promoVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },

    // 2. About Us Page Content
    about: {
        title: "关于零八四商城 (084 Mall)",
        content: "零八四商城 (084 Mall) 成立于2024年，致力于为全球消费者提供高品质的数码、时尚、家居及美食产品。我们秉承“客户至上”的理念，不断优化购物体验。\n\n我们非常荣幸与 卡戎快运 (Charon Express) 达成全球战略合作伙伴关系。无论您身在何处，我们都能确保您的包裹以光速安全送达。",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", 
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },

    // 3. Contact Us Page Content
    contact: {
        intro: "如果您有任何问题，欢迎随时联系我们。我们的客服团队将在 24 小时内回复。",
        address: "创新城科技园 A 座 123 号",
        phone: "400-888-0840",
        email: "support@084mall.com",
        time: "周一至周日 9:00 - 21:00"
    },

    // 4. Product Catalog (Mapped to local PNG images)
    products: [
        // ELEC
        { id: 1, name: "高性能笔记本电脑", price: 8999, category: "elec", image: "images/1.png", reviews: [{user: "极客小张", content: "生产力首选", rating: 5, date: "2023-10-15"}] },
        { id: 2, name: "智能手机 Pro Max", price: 5999, category: "elec", image: "images/2.png", reviews: [] },
        { id: 3, name: "无线降噪耳机", price: 1299, category: "elec", image: "images/3.png", reviews: [] },
        
        // FASHION
        { id: 4, name: "时尚牛仔外套", price: 399, category: "fashion", image: "images/4.png", reviews: [] },
        { id: 5, name: "舒适运动跑鞋", price: 459, category: "fashion", image: "images/5.png", reviews: [] },
        
        // FOOD
        { id: 6, name: "混合坚果礼盒", price: 159, category: "food", image: "images/6.png", reviews: [] },
        { id: 7, name: "手工黑巧克力", price: 88, category: "food", image: "images/7.png", reviews: [] },

        // HOME
        { id: 8, name: "全自动咖啡机", price: 3999, category: "home", image: "images/8.png", reviews: [] },
        { id: 9, name: "智能扫地机器人", price: 2299, category: "home", image: "images/9.png", reviews: [] },

        // TOYS
        { id: 10, name: "积木城堡套装", price: 599, category: "toys", image: "images/10.png", reviews: [] },

        // SPORTS
        { id: 11, name: "专业篮球", price: 189, category: "sports", image: "images/11.png", reviews: [] },

        // BOOKS
        { id: 12, name: "科幻小说全集", price: 128, category: "books", image: "images/12.png", reviews: [] }
    ]
};
