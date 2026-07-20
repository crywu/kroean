const fs = require('fs');

const generateData = () => {
  const categories = {
    '日常': [
      { word: '안녕하세요', pos: 'greeting', meaning: '你好', sentence: '안녕하세요! 만나서 반갑습니다.', sentenceMeaning: '你好！很高興見到你。' },
      { word: '감사합니다', pos: 'greeting', meaning: '謝謝', sentence: '도와주셔서 감사합니다.', sentenceMeaning: '謝謝你的幫忙。' },
      { word: '먹다', pos: 'verb', meaning: '吃', sentence: '저는 지금 밥을 먹고 있습니다.', sentenceMeaning: '我現在正在吃飯。' },
      { word: '마시다', pos: 'verb', meaning: '喝', sentence: '물을 많이 마셔야 해요.', sentenceMeaning: '必須多喝水。' },
      { word: '자다', pos: 'verb', meaning: '睡覺', sentence: '어제 너무 늦게 잤어요.', sentenceMeaning: '昨天太晚睡了。' },
      { word: '보다', pos: 'verb', meaning: '看', sentence: '주말에 영화를 볼 거예요.', sentenceMeaning: '週末要去看電影。' },
      { word: '듣다', pos: 'verb', meaning: '聽', sentence: '음악을 듣는 것을 좋아해요.', sentenceMeaning: '我喜歡聽音樂。' },
      { word: '읽다', pos: 'verb', meaning: '讀', sentence: '매일 책을 읽습니다.', sentenceMeaning: '每天讀書。' },
      { word: '쓰다', pos: 'verb', meaning: '寫', sentence: '편지를 쓰고 있어요.', sentenceMeaning: '正在寫信。' },
      { word: '크다', pos: 'adjective', meaning: '大的', sentence: '이 옷은 저에게 너무 커요.', sentenceMeaning: '這件衣服對我來說太大了。' },
    ],
    '旅遊': [
      { word: '여행', pos: 'noun', meaning: '旅遊', sentence: '이번 주말에 부산으로 여행을 갑니다.', sentenceMeaning: '這個週末要去釜山旅遊。' },
      { word: '비행기', pos: 'noun', meaning: '飛機', sentence: '비행기 표를 예매했어요.', sentenceMeaning: '預訂了機票。' },
      { word: '여권', pos: 'noun', meaning: '護照', sentence: '여행 갈 때 여권을 꼭 챙기세요.', sentenceMeaning: '去旅行時一定要帶護照。' },
      { word: '호텔', pos: 'noun', meaning: '飯店', sentence: '어느 호텔에서 묵으실 건가요?', sentenceMeaning: '你要住在哪家飯店？' },
      { word: '지도', pos: 'noun', meaning: '地圖', sentence: '지도를 보고 길을 찾았어요.', sentenceMeaning: '看地圖找到了路。' },
      { word: '사진', pos: 'noun', meaning: '照片', sentence: '여행 가서 사진을 많이 찍었어요.', sentenceMeaning: '去旅行拍了很多照片。' },
      { word: '기차', pos: 'noun', meaning: '火車', sentence: '기차를 타고 서울에 갑니다.', sentenceMeaning: '搭火車去首爾。' },
      { word: '역', pos: 'noun', meaning: '車站', sentence: '다음 역에서 내려야 해요.', sentenceMeaning: '下一站必須下車。' },
      { word: '표', pos: 'noun', meaning: '票', sentence: '입장표를 두 장 주세요.', sentenceMeaning: '請給我兩張入場券。' },
      { word: '짐', pos: 'noun', meaning: '行李', sentence: '짐이 너무 무거워요.', sentenceMeaning: '行李太重了。' },
    ],
    '時尚': [
      { word: '옷', pos: 'noun', meaning: '衣服', sentence: '새로운 옷을 사고 싶어요.', sentenceMeaning: '我想買新衣服。' },
      { word: '예쁘다', pos: 'adjective', meaning: '漂亮的', sentence: '이 옷이 정말 예쁘네요.', sentenceMeaning: '這件衣服真漂亮。' },
      { word: '바지', pos: 'noun', meaning: '褲子', sentence: '청바지를 자주 입어요.', sentenceMeaning: '我經常穿牛仔褲。' },
      { word: '치마', pos: 'noun', meaning: '裙子', sentence: '오늘 예쁜 치마를 입었어요.', sentenceMeaning: '今天穿了漂亮的裙子。' },
      { word: '신발', pos: 'noun', meaning: '鞋子', sentence: '신발이 아주 편해요.', sentenceMeaning: '鞋子很舒服。' },
      { word: '가방', pos: 'noun', meaning: '包包', sentence: '새 가방을 샀습니다.', sentenceMeaning: '買了新包包。' },
      { word: '모자', pos: 'noun', meaning: '帽子', sentence: '햇빛이 강해서 모자를 썼어요.', sentenceMeaning: '陽光太強，所以戴了帽子。' },
      { word: '안경', pos: 'noun', meaning: '眼鏡', sentence: '눈이 나빠서 안경을 껴야 해요.', sentenceMeaning: '視力不好，必須戴眼鏡。' },
      { word: '시계', pos: 'noun', meaning: '手錶', sentence: '생일 선물로 시계를 받았어요.', sentenceMeaning: '收到了手錶作為生日禮物。' },
      { word: '유행', pos: 'noun', meaning: '流行', sentence: '이 스타일이 요즘 유행이에요.', sentenceMeaning: '這種風格最近很流行。' },
    ],
    '漢字詞': [
      { word: '학교', pos: 'noun', meaning: '學校', sentence: '내일 학교에 가야 합니다.', sentenceMeaning: '明天必須去學校。' },
      { word: '학생', pos: 'noun', meaning: '學生', sentence: '저는 대학교 학생입니다.', sentenceMeaning: '我是大學生。' },
      { word: '도서관', pos: 'noun', meaning: '圖書館', sentence: '도서관에서 공부를 해요.', sentenceMeaning: '在圖書館讀書。' },
      { word: '회사', pos: 'noun', meaning: '公司', sentence: '회사가 집에서 멀어요.', sentenceMeaning: '公司離家很遠。' },
      { word: '운동', pos: 'noun', meaning: '運動', sentence: '매일 아침 운동을 합니다.', sentenceMeaning: '每天早上運動。' },
      { word: '준비', pos: 'noun', meaning: '準備', sentence: '시험 준비를 하고 있어요.', sentenceMeaning: '正在準備考試。' },
      { word: '전화', pos: 'noun', meaning: '電話', sentence: '친구에게 전화를 걸었어요.', sentenceMeaning: '給朋友打了電話。' },
      { word: '시간', pos: 'noun', meaning: '時間', sentence: '지금 시간 있어요?', sentenceMeaning: '現在有時間嗎？' },
      { word: '약속', pos: 'noun', meaning: '約定/約會', sentence: '오늘 저녁에 약속이 있어요.', sentenceMeaning: '今天晚上有約。' },
      { word: '의사', pos: 'noun', meaning: '醫生', sentence: '제 꿈은 의사가 되는 것입니다.', sentenceMeaning: '我的夢想是成為一名醫生。' },
    ]
  };

  const vocabData = [];
  let id = 1;
  const statuses = ['learning', 'learned', 'review'];

  // Generate 100 items for each category
  for (const [category, baseList] of Object.entries(categories)) {
    for (let i = 0; i < 100; i++) {
      const baseItem = baseList[i % baseList.length];
      vocabData.push({
        id: id++,
        word: baseItem.word + (i >= baseList.length ? ` (${Math.floor(i/baseList.length) + 1})` : ''),
        pos: baseItem.pos,
        meaning: baseItem.meaning,
        sentence: baseItem.sentence,
        sentenceMeaning: baseItem.sentenceMeaning,
        category: category,
        status: statuses[i % 3]
      });
    }
  }

  const grammarData = [
    {
      id: 1,
      level: 'TOPIK I 1級',
      title: '-아/어요',
      explanation: '非格式體尊敬階終結語尾。用於一般陳述、疑問、命令或共動，是日常對話中最常用的語尾。',
      examples: [
        { korean: '저는 지금 밥을 먹어요.', highlight: '먹어요', chinese: '我現在正在吃飯。' },
        { korean: '주말에 뭐 해요?', highlight: '해요', chinese: '週末做什麼？' }
      ]
    },
    {
      id: 2,
      level: 'TOPIK I 1級',
      title: '-을/ㄹ 까요?',
      explanation: '用於詢問對方的意見或提議一起做某事。意為「我們...好嗎？」或「...好嗎？」。',
      examples: [
        { korean: '같이 영화를 볼까요?', highlight: '볼까요', chinese: '我們一起看電影好嗎？' },
        { korean: '점심으로 뭘 먹을까요?', highlight: '먹을까요', chinese: '午餐吃什麼好呢？' }
      ]
    },
    {
      id: 3,
      level: 'TOPIK I 2級',
      title: '-고 싶다',
      explanation: '表示說話者的希望或意願。接在動詞語幹後，意為「想...」。',
      examples: [
        { korean: '한국에 가고 싶어요.', highlight: '가고 싶어요', chinese: '我想去韓國。' },
        { korean: '무슨 음식을 먹고 싶어요?', highlight: '먹고 싶어요', chinese: '你想吃什麼食物？' }
      ]
    },
    {
      id: 4,
      level: 'TOPIK I 2級',
      title: '-을/ㄹ 수 있다/없다',
      explanation: '表示能力或可能性。意為「能/不能...」或「會/不會...」。',
      examples: [
        { korean: '한국어를 할 수 있어요.', highlight: '할 수 있어요', chinese: '我會說韓文。' },
        { korean: '오늘은 바빠서 갈 수 없어요.', highlight: '갈 수 없어요', chinese: '今天很忙所以不能去。' }
      ]
    },
    {
      id: 5,
      level: 'TOPIK II 3級',
      title: '-아/어 보다',
      explanation: '表示嘗試做某事，或有做過某事的經驗。意為「試著...」或「做過...」。',
      examples: [
        { korean: '이 옷을 입어 보세요.', highlight: '입어 보세요', chinese: '請試穿這件衣服。' },
        { korean: '제주도에 가 봤어요.', highlight: '가 봤어요', chinese: '我去過濟州島。' }
      ]
    },
    {
      id: 6,
      level: 'TOPIK II 3級',
      title: '-기 때문에',
      explanation: '表示原因或理由。接在動詞、形容詞或名詞(加 이기)後，意為「因為...」。語氣較為正式。',
      examples: [
        { korean: '비가 오기 때문에 안 나갈 거예요.', highlight: '오기 때문에', chinese: '因為下雨，所以不出去。' },
        { korean: '학생이기 때문에 돈이 없어요.', highlight: '학생이기 때문에', chinese: '因為是學生所以沒錢。' }
      ]
    },
    {
      id: 7,
      level: 'TOPIK II 4級',
      title: '-(으)ㄹ 뿐만 아니라',
      explanation: '表示不僅有前面的情況，還加上後面的情況。意為「不僅...而且...」。',
      examples: [
        { korean: '그 사람은 똑똑할 뿐만 아니라 성격도 좋아요.', highlight: '똑똑할 뿐만 아니라', chinese: '那個人不僅聰明，性格也很好。' },
        { korean: '바람이 불 뿐만 아니라 비도 와요.', highlight: '불 뿐만 아니라', chinese: '不僅刮風，還下雨。' }
      ]
    },
    {
      id: 8,
      level: 'TOPIK II 4級',
      title: '-에 불구하고',
      explanation: '表示轉折，雖然有某種情況，但還是發生了後面的結果。意為「儘管...」。',
      examples: [
        { korean: '비가 옴에도 불구하고 경기가 계속되었다.', highlight: '옴에도 불구하고', chinese: '儘管下雨，比賽還是繼續了。' },
        { korean: '나이가 많음에도 불구하고 여전히 건강하다.', highlight: '많음에도 불구하고', chinese: '儘管年紀大了，依然很健康。' }
      ]
    }
  ];

  const content = `export const vocabData = ${JSON.stringify(vocabData, null, 2)};\n\nexport const grammarData = ${JSON.stringify(grammarData, null, 2)};\n`;
  
  fs.writeFileSync('./src/data/mockData.js', content, 'utf8');
  console.log('Data generated successfully!');
};

generateData();
