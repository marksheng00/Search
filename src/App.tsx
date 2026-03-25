import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bookmark, BookOpen, Check, LoaderCircle, Search, SendHorizonal } from "lucide-react";

type ReviewItem = {
  id: string;
  platform: string;
  author: string;
  text: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  bg: string;
  glow: string;
  lines: string[];
  reviews: ReviewItem[];
  meta: string;
  annaUrl: string;
};

type BookGuide = {
  premise: string;
  mood: string;
  pace: string;
  fit: string;
  caution: string;
  charm: string;
};

const previewNotice = "当前展示为原创无剧透预览，正版样章接入后可替换成正式试读内容。";

const previewFallbacks: Record<string, string[]> = {
  huozhe: [
    "先来的不是戏剧性，而是一种很普通、很慢的生活重量。人坐在院子里，天色一点点落下去，身边的器物都带着旧日子的磨损感。你会先感觉到这本书并不急着证明什么，它只是把一个人如何被日常包围、又如何在日常里一点点消耗，轻轻摆在你面前。那些细小的动作、重复的劳作、并不响亮的对话，会比任何夸张情节更早地建立起一种现实感，让你觉得这不是被设计好的苦难，而是生活本身的纹理。",
    "再往里一点，空气会慢慢变得更沉。不是因为作者用力，而是因为你开始意识到，真正难承受的从来不是突然而来的大事，而是那些谁都说不清该怎么挡住的、一次次落在普通人身上的重量。语言越平静，那股后劲反而越明显。很多句子看起来并不锋利，甚至像是随手写下的日常，可读着读着，你会发现这些看似平常的叙述正在一点点改变呼吸，让你从“看别人过日子”，慢慢变成“站在他旁边一起承受”。",
    "这本书很特别的一点，是它不会急着要求你同情谁。它更像把人物放在光线并不强的地方，让你自己慢慢看清他身上的荒唐、迟钝、软弱、忍耐和继续活下去的本能。正因为没有人替你喊痛，那些沉默里反而会不断积起重量。你会觉得每一件事都没有被放大，可恰恰是这种不过度处理的克制，让生活的锋利变得更接近真实，也更难轻易从心里退下去。",
    "所以它的开篇感受，不是要把你一下子击倒，而是让你慢慢站到一个人的命运旁边，安静地看见时间怎样把热闹收走，也看见一个人为什么会在失去之后，还继续把日子往前过。那种力量并不高昂，却会留得很久。它不会像某些故事那样用反转把人钉住，而是让你渐渐明白，所谓“活着”并不总是一个被歌颂的姿态，很多时候只是一个人还在吃饭、还在走路、还在对明天做出最微小的回应。正是这种朴素到近乎残忍的坚持，构成了这本书最强的情感底色。",
  ],
  "3body": [
    "这本书的开篇感不是热闹，而是冷。你先看到的也许仍然是人的世界，是熟悉的判断、熟悉的秩序，可很快就会感觉到有一个更大的尺度正在逼近。它不是立刻给你答案，而是慢慢把脚下那块看似稳固的地面抽空，让你意识到，人类并不总处在自己想象的中心。那种不安不是“发生了什么”的惊吓，而是“原来很多事可以这样被重新解释”的轻微眩晕，好像世界的参数被人悄悄改动了一点。",
    "真正抓人的地方在于，它会让“日常”和“宇宙”出现在同一个画面里。前一秒还是人类社会能理解的逻辑，后一秒视角就被拉得极远，远到你会开始怀疑，很多我们习惯依赖的判断方式，是不是只在很小的范围里才成立。那种寒意并不是夸张，而是来自尺度改变之后的清醒。你会意识到，技术、文明、道德，乃至自我安慰的方式，一旦被放到更冷的背景下审视，很多看似稳固的东西都会开始变薄。",
    "它也不会用纯粹的知识堆砌把人拒之门外。相反，它很擅长把宏大设定落回人可以感受到的层面：一个决定、一段对话、一个视角的转移，都可能让局面忽然变大。你会感觉自己不是在被动接收科幻概念，而是在一步步看见某种更完整的逻辑正在合拢。等你意识到这套逻辑的严密之后，那种压力就会从“新鲜”转向“可怕”，因为你开始发现自己很难轻松地把它当作一个纯幻想故事看过去。",
    "如果你顺着这段预览继续往下读，最先被建立起来的不是情节刺激，而是一种认知上的不安。它让你感觉，真正可怕的东西未必已经显形，但它的轮廓正在靠近。而你一旦意识到这一点，后面的阅读就不再只是追故事，而像是被迫抬头，去看一个过于辽阔的黑夜。那片黑夜最让人不安的地方，不是里面一定藏着敌意，而是它根本不会为了人类的情绪和尺度做出调整。《三体》的开篇感正是这样：不是爆炸性的震惊，而是你突然明白，世界远比自己习惯理解的样子要冷得多。",
  ],
  solitude: [
    "这本书更像一层缓慢张开的空气。你会先看到一座小镇的轮廓，看到屋子、道路、家族、季节和时间彼此缠在一起。它并不急着把人领进主线，而是先让你感到，这里发生的每件事都像和更久远的过去隐隐相连，仿佛一切还没开始，就已经带着回声。你会觉得空间本身像有记忆，甚至连风、尘土和午后的光线，都像在参与某种更漫长的叙述。",
    "再往前，人物和世界不会用最简单的方式出现。他们像是从记忆、传闻、欲望和命运的雾气里慢慢浮出来。你会发现，这本书并不是只想讲某一个人、某一件事，而是试图让你看见时间怎样在一个地方反复折叠，怎样让爱、孤独、野心与失败一再换名字重来。人物之间的关系、情绪之间的牵连，也不会总按照线性的方式展开，它更像是一张不断被补写的地图，某一处笔触会在很远的地方留下回音。",
    "很多人第一次读会觉得它像梦，但更准确地说，它像一种被拉长的记忆状态。你明明知道自己在往前读，可阅读感受却不完全是直线推进，而是不断回头、重叠、彼此映照。某些名字会回来，某些命运会换一种形式再出现，某些看似已经结束的情绪会在另一代人身上重新长出来。正因为如此，你读到的并不只是故事，而像是一种关于人类如何重复自身的缓慢展示。",
    "所以这种试读感受更接近沉进去，而不是抓住你。它不会立刻给你爽快的推进，却会让你很快明白，自己正走进一个会不断扩张的世界。那种扩张不是靠规模，而是靠回响。等你意识到每个人都像在重复某种更大的命运时，这本书的气味就已经留在你身上了。它最强的地方，是让你在被那些奇异、华丽、魔幻的细节吸引的同时，又逐渐感到一种更深的东西在底下运行：人对爱与孤独的追逐，历史对人类的反复召回，以及时间如何温柔又残酷地把一切变成传说。",
  ],
  norwegianwood: [
    "它的开篇气质很轻，却不是轻松。先出现的是一种安静的距离感，像有人站在旧时间边上回头，看见那些年并没有真正过去，只是沉到更深的地方。你会先读到一种空气，一种无法被立刻说清的冷意和潮湿感，而不是明确的情节推进。那种感觉很像某个熟悉的旋律突然在不经意的时候响起，你还没来得及分辨它从哪里来，情绪已经先一步被牵住了。",
    "慢慢地，人物关系和情绪会从这种空气里浮出来。你不会马上得到一个干脆的判断，反而会感觉每个人都带着自己的缺口靠近彼此。爱、失去、沉默和欲望不是被喊出来的，而是停在对话之外、停在场景之间。正因为没有被用力命名，它们才更像真实的青春残响。很多微小的停顿、转身、沉默，都会比直接表白更有力量，因为它们更像青春里真正发生过的样子：不完整，不清晰，却总能在很久之后继续作响。",
    "这本书的特别之处，还在于它从不急着替人物总结自己。你会不断看到他们在试图靠近，又不断看到那些没法被顺利穿过的情绪缝隙。不是每一次相遇都能带来安慰，不是每一种理解都能变成出口。正是这种迟迟落不下来的悬停感，构成了它最难忘的阅读质地。你会觉得人物都很近，可真正触碰到彼此的时候，又总有一层说不清的雾挡在中间。",
    "所以这本书的试读体验，不是被故事猛地往前拖，而是被一种情绪缓慢包住。你会很快知道，它适合在心里比较安静、愿意留一点空白的时候读。它不会立刻替你整理好感受，但会让你记起，很多年少时说不出口的东西，其实一直没有真的消失。那种阅读后的余韵，也不是短促的一下刺痛，而更像深夜里忽然被旧时间碰了一下，最开始只是轻微发酸，等你意识到的时候，已经整片漫了上来。",
  ],
};

const searchFeedbackTimeline = [
  { message: "正在理解你的阅读意图", durationMs: 9000 },
  { message: "正在拆解你在情绪、节奏和主题上的偏好", durationMs: 9000 },
  { message: "正在扩大搜索范围，补充更贴近的候选书", durationMs: 10000 },
  { message: "正在过滤掉气质不对、节奏不对的结果", durationMs: 9000 },
  { message: "正在比对书评气质和内容密度", durationMs: 10000 },
  { message: "正在重排结果，让更可能让你停下来的书先出现", durationMs: 9000 },
  { message: "正在继续搜索，避免太快给你一个草率答案", durationMs: 9000 },
];

const bookGuides: Record<string, BookGuide> = {
  huozhe: {
    premise: "它写的是一个普通人在时代和命运里被不断夺走之后，还怎样继续往前活着。",
    mood: "安静、钝痛、后劲很长",
    pace: "语言很平实，读起来不绕，但情绪会一点点压上来",
    fit: "适合你想读一本会让人慢下来、重新看待生活重量的书",
    caution: "如果你现在只想轻松一点、快速获得情绪释放，它可能会太重",
    charm: "它不替人物喊疼，却让苦难显得格外真实",
  },
  "3body": {
    premise: "它从一次关键的对外回应开始，把人类一下子放进更冷酷的宇宙尺度里。",
    mood: "冷、硬、辽阔，带着持续升高的压迫感",
    pace: "前面会先铺设世界和逻辑，越往后越有被拉着往前读的感觉",
    fit: "适合你想读一本能带来认知冲击、把视角一下拉大的书",
    caution: "如果你现在更想读贴近个人情绪的小体量故事，它未必是第一本",
    charm: "它最厉害的不是脑洞本身，而是让整套宇宙逻辑站得住",
  },
  solitude: {
    premise: "它借一个家族和一座小镇，去写历史、欲望、孤独怎样一代代重复自己。",
    mood: "浓稠、梦一样、带着越来越重的回响",
    pace: "前面需要一点耐心进入节奏，进去之后会更像被氛围持续包住",
    fit: "适合你愿意慢下来，被语言和气质慢慢牵进去的时候读",
    caution: "如果你现在只想抓主线、求快速推进，前面可能会觉得不够直接",
    charm: "它把一个家族史写成了整个人类历史循环的寓言",
  },
  norwegianwood: {
    premise: "它写的不是事件密度，而是青春里的失去、模糊和迟迟落不下来的情绪。",
    mood: "潮湿、克制、带着很长的余震",
    pace: "节奏不急，更像情绪在空气里慢慢停住，而不是剧情一路猛推",
    fit: "适合夜里读，或者你愿意停在复杂情绪里、不急着找答案的时候读",
    caution: "如果你当下更需要明确剧情推动，它可能会显得过于悬停",
    charm: "它最强的地方是把很多说不清的青春情绪写得非常准确",
  },
};

function buildSpoilerFreeReply(book: Book, question: string): string {
  const guide = bookGuides[book.id];
  const normalized = question.replace(/\s+/g, "");

  if (/(剧透|结局|最后|最终|反转|真相|谁死|死了|后面发生|结尾|大结局)/.test(normalized)) {
    return `这个我不回答，避免影响你自己进入《${book.title}》的体验。你如果愿意，我可以改成告诉你它的阅读气质、节奏，或者它适不适合你现在读。`;
  }

  if (/(适合|什么时候|什么状态|适不适合|现在读|值得现在读)/.test(normalized)) {
    return `如果无剧透地说，《${book.title}》${guide.fit}。它的整体气质更接近“${guide.mood}”，所以 ${guide.caution}。`;
  }

  if (/(难读|门槛|好读|读不下去|晦涩|容易读|入门)/.test(normalized)) {
    return `从阅读门槛看，《${book.title}》${guide.pace}。它不一定难在句子本身，更多是看你现在愿不愿意进入这种“${guide.mood}”的阅读状态。`;
  }

  if (/(讲什么|讲的是|内容|故事|主要讲|讲啥|大概)/.test(normalized)) {
    return `无剧透地说，${guide.premise}。但它真正抓人的地方，不只是“发生了什么”，而是 ${guide.charm}。`;
  }

  if (/(情绪|氛围|感觉|后劲|压抑|治愈|痛|沉重)/.test(normalized)) {
    return `《${book.title}》给人的主要感受是“${guide.mood}”。它不一定会立刻给你强刺激，但读完以后通常会留很久。`;
  }

  if (/(节奏|快不快|推进|无聊|拖沓)/.test(normalized)) {
    return `节奏上，《${book.title}》${guide.pace}。如果你想要的是持续追着情节跑的快感，它未必是那一类；如果你愿意被气质慢慢带进去，它会更有后劲。`;
  }

  if (/(为什么|厉害|好看|值得|推荐)/.test(normalized)) {
    return `它值得读的原因，更接近 ${guide.charm}。所以它不是靠硬反转抓你，而是靠整体阅读感慢慢把你留下来。`;
  }

  return `如果先不剧透，《${book.title}》可以先这样理解：${guide.premise}。它的阅读感受更偏“${guide.mood}”，适不适合你，主要看你现在是不是想读这种气质的书。`;
}

const books: Book[] = [
  {
    id: "huozhe",
    title: "活着",
    author: "余华",
    annaUrl: "https://annas-archive.gl/md5/e50d950f4b426cd2283654a3c0871905",
    cover: "活\n着",
    bg: "from-[#140f0f] via-[#2b1614] to-[#513224]",
    glow: "bg-[#ffb27a]",
    lines: [
      "他这一生，亲人一个个离开。",
      "到最后，陪着他的，只剩下一头老牛。",
      "你以为《活着》最打人的地方，是它有多惨。",
      "可真正让人沉进去的，不是苦难本身。",
      "而是一个人被命运一点点剥掉所有之后，竟然还在往前走。",
      "富贵年轻时荒唐、轻佻，把人生过得像一场玩笑。",
      "后来生活没有跟他讲道理，只是一笔一笔地把代价算回来。",
      "亲人离开，时代碾过，命运没有给他任何体面的出口。",
      "可余华没有替他哭，也没有替读者喊疼。",
      "他只是把‘活着’这件事，安静地摆在你面前。",
      "于是你忽然明白，原来活着不是一种答案。",
      "活着本身，就已经是一种几乎残忍的力量。",
    ],
    reviews: [
      {
        id: "huozhe-douban",
        platform: "豆瓣",
        author: "青山",
        text: "这本书最狠的地方不是悲剧多，而是余华写得太安静。读完以后不会立刻哭，只会很久都说不出话。",
      },
      {
        id: "huozhe-wechat",
        platform: "微信读书",
        author: "周末读者",
        text: "以前总以为它在写命苦，后来才发现它真正写的是人被生活反复击中之后，为什么还要继续走下去。",
      },
      {
        id: "huozhe-xiaohongshu",
        platform: "小红书",
        author: "阿栗",
        text: "不适合想快速获得安慰的时候读，但很适合在你开始重新看待生活重量的时候读。",
      },
      {
        id: "huozhe-zhihu",
        platform: "知乎",
        author: "沉默的旁观者",
        text: "《活着》并不提供答案，它只是把活着这件事放到你面前，让你意识到这本身已经是一种力量。",
      },
    ],
    meta: "一本把‘活着’两个字写到骨头里的小说",
  },
  {
    id: "3body",
    title: "三体",
    author: "刘慈欣",
    annaUrl: "https://annas-archive.gl/md5/1473ae1eb74edc729090dd180783aee4",
    cover: "三\n体",
    bg: "from-[#07131f] via-[#0b2231] to-[#143f3b]",
    glow: "bg-[#89fff0]",
    lines: [
      "如果宇宙里真的有别的文明，最可怕的不是他们存在。",
      "而是他们知道你存在。",
      "从那一刻开始，人类的命运就已经被改写。",
      "《三体》真正让人上头的，不是外星人入侵。",
      "而是它第一次让你认真怀疑：人类是不是从来都高估了自己。",
      "一个偶然发出的信号，把地球暴露在更冷酷的宇宙秩序里。",
      "你原本以为自己在读一部科幻小说。",
      "可读着读着，你会感觉自己像被拽离地表。",
      "熟悉的文明、科技、伦理，忽然都不再牢靠。",
      "三体人真正可怕的，不只是强大。",
      "而是他们逼着人类第一次站在宇宙尺度上重新认识自己。",
      "那种渺小感，不来自失败，而来自清醒。",
    ],
    reviews: [
      {
        id: "3body-douban",
        platform: "豆瓣",
        author: "Rhea",
        text: "它真正厉害的不是脑洞，而是把人类从习惯的中心位置上拽下来，让你第一次认真感到渺小。",
      },
      {
        id: "3body-wechat",
        platform: "微信读书",
        author: "M87",
        text: "越读越觉得可怕的不是外星人，而是整套逻辑自洽到让你无法轻易反驳。",
      },
      {
        id: "3body-zhihu",
        platform: "知乎",
        author: "星海边缘",
        text: "如果只是想看爽文，读到后面会意外发现它更像一场认知暴露测试，把人类文明的脆弱都摊开了。",
      },
      {
        id: "3body-xiaohongshu",
        platform: "小红书",
        author: "凌晨看宇宙",
        text: "看完之后再抬头看夜空，真的会有一种熟悉世界突然变冷的感觉。",
      },
    ],
    meta: "一本会永久改变你看待宇宙方式的小说",
  },
  {
    id: "solitude",
    title: "百年孤独",
    author: "加西亚·马尔克斯",
    annaUrl: "https://annas-archive.gl/md5/571d3134c990314087b6eb4b9e6b03f4",
    cover: "百年\n孤独",
    bg: "from-[#10160d] via-[#1f2d14] to-[#54431f]",
    glow: "bg-[#f4df89]",
    lines: [
      "有些家族，看起来是在活着。",
      "其实只是在一代一代地重复命运。",
      "《百年孤独》最迷人的，不是魔幻。",
      "而是你读着读着，会忽然觉得：人类的历史，原来也一直在原地打转。",
      "马孔多像一个被世界遗忘的小镇。",
      "可越往里读，你越会发现，它其实像整个世界的缩影。",
      "欲望、爱情、战争、孤独、野心，一代一代换了名字重新上演。",
      "每个人都以为自己在往前走。",
      "可命运只是换了一种方式，把他们送回原地。",
      "所以这本书最强的地方，从来不是故事有多奇。",
      "而是那种越来越重的感觉：人也许从来不会真正吸取历史。",
      "读到最后，你像做完一场很长的梦。",
    ],
    reviews: [
      {
        id: "solitude-douban",
        platform: "豆瓣",
        author: "闻风",
        text: "真正迷人的从来不是魔幻设定，而是那种一代一代绕不出去的孤独感，像历史在原地回响。",
      },
      {
        id: "solitude-wechat",
        platform: "微信读书",
        author: "晚安马孔多",
        text: "前面需要耐心，但一旦进去，就会发现这本书不是在讲一个家族，而是在讲整个人类如何重复自己。",
      },
      {
        id: "solitude-zhihu",
        platform: "知乎",
        author: "旧地图",
        text: "阅读体验很像做梦，人物、时间和命运彼此缠绕，读完以后最难忘的不是情节，是那股挥不掉的气息。",
      },
      {
        id: "solitude-xiaohongshu",
        platform: "小红书",
        author: "小岛夜读",
        text: "不适合快读，适合愿意被氛围慢慢包住的人。它不是立刻抓你，是读完以后一直跟着你。",
      },
    ],
    meta: "一本会把家族史写成整个人类寓言的小说",
  },
  {
    id: "norwegianwood",
    title: "挪威的森林",
    author: "村上春树",
    annaUrl: "https://annas-archive.gl/md5/374e68e2c29d9f066c745bc3640f6382",
    cover: "挪威的\n森林",
    bg: "from-[#101313] via-[#16221d] to-[#30463c]",
    glow: "bg-[#b8ffda]",
    lines: [
      "有些青春并不明亮。",
      "它只是安静地，把一个人困在失去里很多年。",
      "《挪威的森林》打人的地方，从来不是故事多曲折。",
      "而是它让你承认：不是每一个人，都能从年少时的裂缝里完整走出来。",
      "渡边、直子、绿子，看起来只是三个人的相遇。",
      "可真正缠住你的，是他们之间始终无法被说清的情绪。",
      "爱、欲望、死亡、孤独，都没有真正落地。",
      "它们像雾一样，一直停在空气里。",
      "所以你读这本书时，最容易上头的不是情节推进。",
      "而是那些你以为自己早就忘了的青春余震。",
      "它让你重新看见，原来成长从来不是变得完整。",
      "很多时候，只是学会带着裂缝继续生活。",
    ],
    reviews: [
      {
        id: "norwegianwood-douban",
        platform: "豆瓣",
        author: "白昼月光",
        text: "它不靠剧情起伏取胜，而是靠情绪的悬停感。很多东西都没有说破，但正因为没有说破才更难忘。",
      },
      {
        id: "norwegianwood-wechat",
        platform: "微信读书",
        author: "深夜电台",
        text: "青春最难受的往往不是失去本身，而是你根本说不清自己到底失去了什么，这本书把这种感觉写得很准。",
      },
      {
        id: "norwegianwood-zhihu",
        platform: "知乎",
        author: "岸边",
        text: "如果期待强剧情，可能会失望；但如果愿意停在那种模糊、潮湿、无法解释的情绪里，它会很有后劲。",
      },
      {
        id: "norwegianwood-xiaohongshu",
        platform: "小红书",
        author: "晚风",
        text: "很适合夜里看，读完像被旧时间轻轻拉了一下，不是痛一下就结束，而是慢慢漫上来。",
      },
    ],
    meta: "一本适合在情绪低处慢慢沉进去的小说",
  },
];

export default function BookSwipeReaderPrototype() {
  const visibleLineCount = 6;
  const previewResistanceThreshold = 48;
  const previewBreakthroughThreshold = 84;
  const panelSpring = { type: "spring", stiffness: 220, damping: 28 } as const;
  const searchSpring = { type: "spring", stiffness: 260, damping: 26 } as const;
  const [index, setIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [annaOpen, setAnnaOpen] = useState(false);
  const [annaLoading, setAnnaLoading] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [savedBooks, setSavedBooks] = useState<Record<string, boolean>>({});
  const [acquireState, setAcquireState] = useState<Record<string, "idle" | "loading" | "success">>({});
  const [searchDraft, setSearchDraft] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [collapseSearchOnNextBook, setCollapseSearchOnNextBook] = useState(false);
  const [searchFeedbackState, setSearchFeedbackState] = useState<"idle" | "loading" | "ready">("idle");
  const [searchFeedbackIndex, setSearchFeedbackIndex] = useState(0);
  const [chatDrafts, setChatDrafts] = useState<Record<string, string>>({});
  const [bookChats, setBookChats] = useState<Record<string, ChatMessage[]>>({});
  const [chatLoading, setChatLoading] = useState<Record<string, boolean>>({});
  const [previewPull, setPreviewPull] = useState(0);
  const [previewExitPull, setPreviewExitPull] = useState(0);
  const [previewAnnaPull, setPreviewAnnaPull] = useState(0);
  const [previewExitHintVisible, setPreviewExitHintVisible] = useState(false);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const wheelGestureRef = useRef({ x: 0, y: 0, lastTs: 0, lockedUntil: 0 });
  const previewGestureRef = useRef({ wheel: 0, touch: 0, lastTouchY: 0 });
  const previewExitGestureRef = useRef({ wheel: 0, touch: 0, lastTouchY: 0 });
  const previewAnnaGestureRef = useRef({ wheel: 0, touch: 0 });
  const previewResetTimerRef = useRef<number | null>(null);
  const previewExitResetTimerRef = useRef<number | null>(null);
  const previewAnnaResetTimerRef = useRef<number | null>(null);
  const replyTimersRef = useRef<number[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const book = books[index];
  const reviewFeed = book.reviews;
  const previewContent = previewFallbacks[book.id] ?? [];
  const chatThread = bookChats[book.id] ?? [];
  const chatIsLoading = chatLoading[book.id] ?? false;
  const searchIsLoading = searchFeedbackState === "loading";
  const visibleStart = Math.max(0, sceneIndex - (visibleLineCount - 1));
  const visibleLines = book.lines.slice(visibleStart, sceneIndex + 1);
  const previewArmed = previewPull >= previewResistanceThreshold;
  const previewPullProgress = Math.min(previewPull / previewResistanceThreshold, 1);
  const previewBreakProgress = Math.min(
    Math.max((previewPull - previewResistanceThreshold) / (previewBreakthroughThreshold - previewResistanceThreshold), 0),
    1,
  );
  const previewExitArmed = previewExitPull >= previewResistanceThreshold;
  const previewExitPullProgress = Math.min(previewExitPull / previewResistanceThreshold, 1);
  const previewExitBreakProgress = Math.min(
    Math.max((previewExitPull - previewResistanceThreshold) / (previewBreakthroughThreshold - previewResistanceThreshold), 0),
    1,
  );
  const previewAnnaArmed = previewAnnaPull >= previewResistanceThreshold;
  const previewAnnaPullProgress = Math.min(previewAnnaPull / previewResistanceThreshold, 1);
  const previewAnnaBreakProgress = Math.min(
    Math.max((previewAnnaPull - previewResistanceThreshold) / (previewBreakthroughThreshold - previewResistanceThreshold), 0),
    1,
  );
  const previewExitHintActive = previewExitHintVisible || previewExitPull > 0;

  useEffect(() => {
    setSceneIndex(0);
    setPreviewOpen(false);
    setAnnaOpen(false);
    setAnnaLoading(false);
    setPreviewPull(0);
    setPreviewExitPull(0);
    setPreviewAnnaPull(0);
    setPreviewExitHintVisible(false);
    previewGestureRef.current = { wheel: 0, touch: 0, lastTouchY: 0 };
    previewExitGestureRef.current = { wheel: 0, touch: 0, lastTouchY: 0 };
    previewAnnaGestureRef.current = { wheel: 0, touch: 0 };
  }, [index, detailOpen]);

  useEffect(() => {
    if (detailOpen) return;
    if (sceneIndex >= book.lines.length - 1) return;

    const timer = window.setTimeout(() => {
      setSceneIndex((prev) => Math.min(prev + 1, book.lines.length - 1));
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [sceneIndex, detailOpen, book.lines]);

  useEffect(() => {
    if (searchCollapsed) return;

    const frame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [searchCollapsed]);

  useEffect(() => {
    if (searchFeedbackState !== "loading") return;

    const currentStep = searchFeedbackTimeline[Math.min(searchFeedbackIndex, searchFeedbackTimeline.length - 1)];

    if (searchFeedbackIndex >= searchFeedbackTimeline.length - 1) {
      const readyTimer = window.setTimeout(() => {
        setSearchFeedbackState("ready");
      }, currentStep.durationMs);

      return () => window.clearTimeout(readyTimer);
    }

    const stepTimer = window.setTimeout(() => {
      setSearchFeedbackIndex((prev) => prev + 1);
    }, currentStep.durationMs);

    return () => window.clearTimeout(stepTimer);
  }, [searchFeedbackState, searchFeedbackIndex]);

  useEffect(() => {
    if (searchFeedbackState === "loading") return;
    if (searchFeedbackState === "ready") {
      setSearchFeedbackIndex(searchFeedbackTimeline.length - 1);
      return;
    }

    setSearchFeedbackIndex(0);
  }, [searchFeedbackState]);

  useEffect(() => {
    setPreviewExitPull(0);
    setPreviewAnnaPull(0);
    previewExitGestureRef.current = { wheel: 0, touch: 0, lastTouchY: 0 };
    previewAnnaGestureRef.current = { wheel: 0, touch: 0 };
    setPreviewExitHintVisible(previewOpen);
    if (!previewOpen) {
      setAnnaOpen(false);
      setAnnaLoading(false);
    }
  }, [previewOpen]);

  useEffect(() => {
    if (!annaOpen || !annaLoading) return;

    const timer = window.setTimeout(() => {
      setAnnaLoading(false);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [annaOpen, annaLoading]);

  useEffect(() => {
    return () => {
      if (previewResetTimerRef.current) {
        window.clearTimeout(previewResetTimerRef.current);
      }
      if (previewExitResetTimerRef.current) {
        window.clearTimeout(previewExitResetTimerRef.current);
      }
      if (previewAnnaResetTimerRef.current) {
        window.clearTimeout(previewAnnaResetTimerRef.current);
      }
      replyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const changeBook = (dir: number) => {
    setDetailOpen(false);
    if (activeSearch && collapseSearchOnNextBook) {
      setSearchCollapsed(true);
      setCollapseSearchOnNextBook(false);
    }
    setIndex((prev) => {
      const next = prev + dir;
      if (next < 0 || next >= books.length) return prev;
      return next;
    });
  };

  const onPointerStart = (e: React.PointerEvent<HTMLDivElement>) => {
    startRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (previewOpen || annaOpen) return;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < -48 && !detailOpen) setDetailOpen(true);
      if (dx > 48 && detailOpen) setDetailOpen(false);
      return;
    }

    if (!detailOpen) {
      if (dy < -48) changeBook(1);
      if (dy > 48) changeBook(-1);
    }
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (previewOpen || annaOpen) return;

    const target = e.target as HTMLElement | null;
    if (target?.closest("input, textarea, button")) return;

    const now = performance.now();
    const state = wheelGestureRef.current;

    if (now - state.lastTs > 160) {
      state.x = 0;
      state.y = 0;
    }

    state.lastTs = now;

    if (now < state.lockedUntil) {
      return;
    }

    const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY);

    if (horizontalIntent) {
      state.x += e.deltaX;
      state.y = 0;

      if (!detailOpen && state.x > 90) {
        e.preventDefault();
        setDetailOpen(true);
        state.x = 0;
        state.lockedUntil = now + 420;
      }

      if (detailOpen && state.x < -90) {
        e.preventDefault();
        setDetailOpen(false);
        state.x = 0;
        state.lockedUntil = now + 420;
      }

      return;
    }

    if (detailOpen) return;

    state.y += e.deltaY;
    state.x = 0;

    if (state.y > 90) {
      e.preventDefault();
      changeBook(1);
      state.y = 0;
      state.lockedUntil = now + 420;
    }

    if (state.y < -90) {
      e.preventDefault();
      changeBook(-1);
      state.y = 0;
      state.lockedUntil = now + 420;
    }
  };

  const isNearDetailBottom = (node: HTMLDivElement | null) => {
    if (!node) return false;
    return node.scrollHeight - node.scrollTop - node.clientHeight < 28;
  };

  const isNearPreviewTop = (node: HTMLDivElement | null) => {
    if (!node) return false;
    return node.scrollTop < 28;
  };

  const isNearPreviewBottom = (node: HTMLDivElement | null) => {
    if (!node) return false;
    return node.scrollHeight - node.scrollTop - node.clientHeight < 28;
  };

  const shouldShowPreviewExitHint = (node: HTMLDivElement | null) => {
    if (!node) return true;
    return node.scrollTop < 72;
  };

  const resetPreviewGesture = () => {
    if (previewResetTimerRef.current) {
      window.clearTimeout(previewResetTimerRef.current);
      previewResetTimerRef.current = null;
    }

    previewGestureRef.current.wheel = 0;
    previewGestureRef.current.touch = 0;
    setPreviewPull(0);
  };

  const schedulePreviewReset = (delay = 150) => {
    if (previewResetTimerRef.current) {
      window.clearTimeout(previewResetTimerRef.current);
    }

    previewResetTimerRef.current = window.setTimeout(() => {
      previewGestureRef.current.wheel = 0;
      previewGestureRef.current.touch = 0;
      setPreviewPull(0);
      previewResetTimerRef.current = null;
    }, delay);
  };

  const resetPreviewExitGesture = () => {
    if (previewExitResetTimerRef.current) {
      window.clearTimeout(previewExitResetTimerRef.current);
      previewExitResetTimerRef.current = null;
    }

    previewExitGestureRef.current.wheel = 0;
    previewExitGestureRef.current.touch = 0;
    setPreviewExitPull(0);
  };

  const resetPreviewAnnaGesture = () => {
    if (previewAnnaResetTimerRef.current) {
      window.clearTimeout(previewAnnaResetTimerRef.current);
      previewAnnaResetTimerRef.current = null;
    }

    previewAnnaGestureRef.current.wheel = 0;
    previewAnnaGestureRef.current.touch = 0;
    setPreviewAnnaPull(0);
  };

  const schedulePreviewExitReset = (delay = 150) => {
    if (previewExitResetTimerRef.current) {
      window.clearTimeout(previewExitResetTimerRef.current);
    }

    previewExitResetTimerRef.current = window.setTimeout(() => {
      previewExitGestureRef.current.wheel = 0;
      previewExitGestureRef.current.touch = 0;
      setPreviewExitPull(0);
      previewExitResetTimerRef.current = null;
    }, delay);
  };

  const schedulePreviewAnnaReset = (delay = 150) => {
    if (previewAnnaResetTimerRef.current) {
      window.clearTimeout(previewAnnaResetTimerRef.current);
    }

    previewAnnaResetTimerRef.current = window.setTimeout(() => {
      previewAnnaGestureRef.current.wheel = 0;
      previewAnnaGestureRef.current.touch = 0;
      setPreviewAnnaPull(0);
      previewAnnaResetTimerRef.current = null;
    }, delay);
  };

  const openAnnaPage = () => {
    resetPreviewAnnaGesture();
    setAnnaLoading(true);
    setAnnaOpen(true);
  };

  const accumulatePreviewGesture = (delta: number, source: "wheel" | "touch") => {
    if (!detailOpen || previewOpen) return;

    const node = detailScrollRef.current;
    if (!isNearDetailBottom(node) || delta <= 0) {
      resetPreviewGesture();
      return;
    }

    const currentPull = Math.max(previewGestureRef.current.wheel, previewGestureRef.current.touch);
    const resistedDelta = delta * (currentPull >= previewResistanceThreshold ? 0.24 : 0.46);
    previewGestureRef.current[source] += resistedDelta;
    const nextPull = Math.max(previewGestureRef.current.wheel, previewGestureRef.current.touch);
    setPreviewPull(nextPull);

    if (nextPull > previewBreakthroughThreshold) {
      resetPreviewGesture();
      setPreviewOpen(true);
      return;
    }

    schedulePreviewReset(source === "wheel" ? 180 : 120);
  };

  const accumulatePreviewExitGesture = (delta: number, source: "wheel" | "touch") => {
    if (!previewOpen) return;

    const node = previewScrollRef.current;
    if (!isNearPreviewTop(node) || delta <= 0) {
      resetPreviewExitGesture();
      return;
    }

    const currentPull = Math.max(previewExitGestureRef.current.wheel, previewExitGestureRef.current.touch);
    const resistedDelta = delta * (currentPull >= previewResistanceThreshold ? 0.24 : 0.46);
    previewExitGestureRef.current[source] += resistedDelta;
    const nextPull = Math.max(previewExitGestureRef.current.wheel, previewExitGestureRef.current.touch);
    setPreviewExitPull(nextPull);

    if (nextPull > previewBreakthroughThreshold) {
      resetPreviewExitGesture();
      setPreviewOpen(false);
      return;
    }

    schedulePreviewExitReset(source === "wheel" ? 180 : 120);
  };

  const accumulatePreviewAnnaGesture = (delta: number, source: "wheel" | "touch") => {
    if (!previewOpen) return;

    const node = previewScrollRef.current;
    if (!isNearPreviewBottom(node) || delta <= 0) {
      resetPreviewAnnaGesture();
      return;
    }

    const currentPull = Math.max(previewAnnaGestureRef.current.wheel, previewAnnaGestureRef.current.touch);
    const resistedDelta = delta * (currentPull >= previewResistanceThreshold ? 0.24 : 0.46);
    previewAnnaGestureRef.current[source] += resistedDelta;
    const nextPull = Math.max(previewAnnaGestureRef.current.wheel, previewAnnaGestureRef.current.touch);
    setPreviewAnnaPull(nextPull);

    if (nextPull > previewBreakthroughThreshold) {
      resetPreviewAnnaGesture();
      openAnnaPage();
      return;
    }

    schedulePreviewAnnaReset(source === "wheel" ? 180 : 120);
  };

  const onDetailWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!detailOpen || previewOpen) return;

    if (e.deltaY <= 0) {
      resetPreviewGesture();
      return;
    }

    if (isNearDetailBottom(detailScrollRef.current)) {
      e.preventDefault();
    }

    accumulatePreviewGesture(e.deltaY, "wheel");
  };

  const onDetailTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    previewGestureRef.current.lastTouchY = e.touches[0]?.clientY ?? 0;
  };

  const onDetailTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0]?.clientY ?? 0;
    const delta = previewGestureRef.current.lastTouchY - currentY;
    previewGestureRef.current.lastTouchY = currentY;

    if (delta <= 0) {
      resetPreviewGesture();
      return;
    }

    if (isNearDetailBottom(detailScrollRef.current)) {
      e.preventDefault();
    }

    accumulatePreviewGesture(delta, "touch");
  };

  const onDetailTouchEnd = () => {
    schedulePreviewReset(90);
  };

  const onPreviewWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!previewOpen) return;

    if (e.deltaY > 0) {
      if (isNearPreviewBottom(previewScrollRef.current)) {
        e.preventDefault();
      }

      accumulatePreviewAnnaGesture(e.deltaY, "wheel");

      if (!shouldShowPreviewExitHint(previewScrollRef.current)) {
        setPreviewExitHintVisible(false);
      }
      resetPreviewExitGesture();
      return;
    }

    resetPreviewAnnaGesture();
    setPreviewExitHintVisible(true);

    if (isNearPreviewTop(previewScrollRef.current)) {
      e.preventDefault();
    }

    accumulatePreviewExitGesture(-e.deltaY, "wheel");
  };

  const onPreviewTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    previewExitGestureRef.current.lastTouchY = e.touches[0]?.clientY ?? 0;
  };

  const onPreviewTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0]?.clientY ?? 0;
    const delta = currentY - previewExitGestureRef.current.lastTouchY;
    const forwardDelta = previewExitGestureRef.current.lastTouchY - currentY;
    previewExitGestureRef.current.lastTouchY = currentY;

    if (forwardDelta > 0) {
      if (isNearPreviewBottom(previewScrollRef.current)) {
        e.preventDefault();
      }

      accumulatePreviewAnnaGesture(forwardDelta, "touch");

      if (!shouldShowPreviewExitHint(previewScrollRef.current)) {
        setPreviewExitHintVisible(false);
      }
      resetPreviewExitGesture();
      return;
    }

    resetPreviewAnnaGesture();

    if (delta <= 0) {
      return;
    }

    setPreviewExitHintVisible(true);

    if (isNearPreviewTop(previewScrollRef.current)) {
      e.preventDefault();
    }

    accumulatePreviewExitGesture(delta, "touch");
  };

  const onPreviewTouchEnd = () => {
    schedulePreviewExitReset(90);
    schedulePreviewAnnaReset(90);
  };

  const onPreviewScroll = () => {
    if (!previewOpen) return;
    setPreviewExitHintVisible(shouldShowPreviewExitHint(previewScrollRef.current) || previewExitPull > 0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (annaOpen) {
      if (e.key === "Escape" || e.key === "ArrowRight") setAnnaOpen(false);
      return;
    }

    if (previewOpen) {
      if (e.key === "Escape" || e.key === "ArrowRight") setPreviewOpen(false);
      return;
    }

    if (e.key === "ArrowUp") changeBook(-1);
    if (e.key === "ArrowDown") changeBook(1);
    if (e.key === "ArrowLeft") setDetailOpen(true);
    if (e.key === "ArrowRight") setDetailOpen(false);
  };

  const toggleSave = (bookId: string) => {
    setSavedBooks((prev) => ({ ...prev, [bookId]: !prev[bookId] }));
  };

  const handleAcquire = (bookId: string) => {
    if (acquireState[bookId] === "loading" || acquireState[bookId] === "success") return;

    setAcquireState((prev) => ({ ...prev, [bookId]: "loading" }));

    window.setTimeout(() => {
      setAcquireState((prev) => ({ ...prev, [bookId]: "success" }));
    }, 1800);
  };

  const handleSearchSubmit = () => {
    const nextSearch = searchDraft.trim();
    if (!nextSearch) return;

    setActiveSearch(nextSearch);
    setSearchCollapsed(false);
    setCollapseSearchOnNextBook(true);
    setSearchFeedbackIndex(0);
    setSearchFeedbackState("loading");
  };

  const handleSearchRestore = () => {
    if (!activeSearch) return;
    setSearchCollapsed(false);
    setCollapseSearchOnNextBook(true);
  };

  const handleSearchEdit = () => {
    if (!activeSearch) return;
    setSearchDraft(activeSearch);
    setSearchCollapsed(false);
    setCollapseSearchOnNextBook(false);
    setSearchFeedbackIndex(0);
    setSearchFeedbackState("idle");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleChatDraftChange = (bookId: string, value: string) => {
    setChatDrafts((prev) => ({ ...prev, [bookId]: value }));
  };

  const currentSearchFeedback =
    searchFeedbackState === "ready"
      ? "继续下滑，看看新的推荐结果"
      : searchFeedbackTimeline[Math.min(searchFeedbackIndex, searchFeedbackTimeline.length - 1)].message;

  const handleAskBook = (bookId: string) => {
    const question = (chatDrafts[bookId] ?? "").trim();
    if (!question || chatLoading[bookId]) return;

    const bookData = books.find((item) => item.id === bookId);
    if (!bookData) return;

    setBookChats((prev) => ({
      ...prev,
      [bookId]: [
        ...(prev[bookId] ?? []),
        {
          id: `${bookId}-user-${Date.now()}`,
          role: "user",
          text: question,
        },
      ],
    }));
    setChatDrafts((prev) => ({ ...prev, [bookId]: "" }));
    setChatLoading((prev) => ({ ...prev, [bookId]: true }));

    const timer = window.setTimeout(() => {
      setBookChats((prev) => ({
        ...prev,
        [bookId]: [
          ...(prev[bookId] ?? []),
          {
            id: `${bookId}-assistant-${Date.now()}`,
            role: "assistant",
            text: buildSpoilerFreeReply(bookData, question),
          },
        ],
      }));
      setChatLoading((prev) => ({ ...prev, [bookId]: false }));
      replyTimersRef.current = replyTimersRef.current.filter((item) => item !== timer);
    }, 1200);

    replyTimersRef.current.push(timer);
  };

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, bookId: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAskBook(bookId);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-0 text-white">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerStart}
        onPointerUp={onPointerEnd}
        onWheel={onWheel}
        className="relative h-screen w-full overflow-hidden bg-black outline-none md:h-[820px] md:max-w-[390px] md:rounded-[34px] md:border md:border-white/10 md:shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={book.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{
                x: detailOpen ? "-100%" : "0%",
                scale: detailOpen ? 0.988 : 1,
                opacity: detailOpen ? 0.9 : 1,
              }}
              transition={panelSpring}
              className="absolute inset-0"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${book.bg}`} />
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.26, 0.18] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute left-1/2 top-[18%] h-64 w-64 -translate-x-1/2 rounded-full blur-3xl ${book.glow}`}
              />
              <motion.div
                animate={{ scale: [1.05, 0.96, 1.05], opacity: [0.12, 0.22, 0.12] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-[-10%] h-64 w-64 rounded-full bg-white blur-3xl"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.22)_30%,rgba(0,0,0,0.5)_65%,rgba(0,0,0,0.88)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.16)_46%,rgba(0,0,0,0.54)_100%)]" />

              <div className="relative flex h-full flex-col px-7 pb-10 pt-8">
                <div className="flex justify-center">
                  <div className="h-1.5 w-24 rounded-full bg-white/12 md:hidden" />
                </div>

                <motion.div layout transition={searchSpring} className="mt-3">
                  <AnimatePresence mode="wait" initial={false}>
                    {activeSearch && searchCollapsed ? (
                      <motion.button
                        key="collapsed-search"
                        layout
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={searchSpring}
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        onClick={handleSearchRestore}
                        title={activeSearch}
                        aria-label={`当前搜索：${activeSearch}。点击查看搜索进度`}
                        className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/18 text-left backdrop-blur-xl transition hover:bg-black/24"
                        whileHover={searchIsLoading ? undefined : { scale: 1.04 }}
                      >
                        <motion.div
                          animate={
                            searchIsLoading
                              ? { boxShadow: ["0 0 0 rgba(255,255,255,0)", "0 0 0 8px rgba(255,255,255,0.06)", "0 0 0 rgba(255,255,255,0)"] }
                              : { boxShadow: "0 0 0 rgba(255,255,255,0)" }
                          }
                          transition={{ duration: 1.8, repeat: searchIsLoading ? Infinity : 0, ease: "easeOut" }}
                          className="flex h-11 w-11 items-center justify-center rounded-full"
                        >
                          {searchIsLoading ? (
                            <LoaderCircle className="h-[18px] w-[18px] animate-spin text-white/78" />
                          ) : (
                            <Search className="h-[18px] w-[18px] text-white/78" />
                          )}
                        </motion.div>
                      </motion.button>
                    ) : activeSearch && collapseSearchOnNextBook ? (
                      <motion.button
                        key="submitted-search"
                        layout
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={searchSpring}
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        onClick={handleSearchEdit}
                        aria-label={`当前搜索：${activeSearch}。点击重新输入`}
                        className="flex w-full items-center gap-3 rounded-[24px] border border-white/10 bg-black/18 px-4 py-3 text-left backdrop-blur-xl transition hover:bg-black/24"
                        whileHover={searchIsLoading ? undefined : { scale: 1.01 }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-white/88">{activeSearch}</p>
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.p
                              key={`${searchFeedbackState}-${searchFeedbackIndex}`}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                              className="mt-1 text-[12px] text-white/42"
                            >
                              {currentSearchFeedback}
                            </motion.p>
                          </AnimatePresence>
                        </div>
                        <motion.div
                          animate={
                            searchIsLoading
                              ? { opacity: [0.82, 1, 0.82] }
                              : { opacity: 1 }
                          }
                          transition={{ duration: 1.6, repeat: searchIsLoading ? Infinity : 0, ease: "easeInOut" }}
                          className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/82"
                        >
                          {searchIsLoading ? (
                            <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                          ) : (
                            <Search className="h-[18px] w-[18px]" />
                          )}
                        </motion.div>
                      </motion.button>
                    ) : (
                      <motion.div
                        key="expanded-search"
                        layout
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={searchSpring}
                        className="rounded-[28px] border border-white/10 bg-black/18 p-3 backdrop-blur-xl"
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchDraft}
                            onChange={(e) => setSearchDraft(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            placeholder="说说你现在想读什么样的书"
                            className="min-w-0 flex-1 bg-transparent text-sm leading-6 text-white outline-none placeholder:text-white/26"
                          />
                          <motion.button
                            whileTap={searchFeedbackState === "loading" ? undefined : { scale: 0.94 }}
                            whileHover={searchFeedbackState === "loading" ? undefined : { scale: 1.04 }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            onClick={handleSearchSubmit}
                            aria-label="开始搜索"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/88 backdrop-blur-sm transition hover:bg-white/15 disabled:cursor-not-allowed disabled:border-white/6 disabled:bg-white/6 disabled:text-white/26"
                            disabled={!searchDraft.trim()}
                          >
                            {searchFeedbackState === "loading" ? (
                              <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                            ) : (
                              <Search className="h-[18px] w-[18px]" />
                            )}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 }}
                  className="absolute inset-x-7 bottom-10 z-20 flex items-end justify-between gap-5"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] text-white/92">{book.title}</p>
                    <p className="mt-1 text-sm text-white/48">{book.author}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 pb-1">
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.04 }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onClick={() => toggleSave(book.id)}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm transition ${
                        savedBooks[book.id]
                          ? "border-white/0 bg-white text-black"
                          : "border-white/10 bg-white/10 text-white/88 hover:bg-white/15"
                      }`}
                    >
                      <motion.div
                        animate={{ scale: savedBooks[book.id] ? 1.08 : 1 }}
                        transition={{ type: "spring", stiffness: 360, damping: 20 }}
                      >
                        <Bookmark
                          className="h-[18px] w-[18px]"
                          fill={savedBooks[book.id] ? "currentColor" : "none"}
                        />
                      </motion.div>
                    </motion.button>

                    <motion.button
                      whileTap={acquireState[book.id] === "loading" ? undefined : { scale: 0.92 }}
                      whileHover={acquireState[book.id] === "loading" ? undefined : { scale: 1.04 }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onClick={() => handleAcquire(book.id)}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm transition ${
                        acquireState[book.id] === "success"
                          ? "border-white/0 bg-white text-black"
                          : "border-white/10 bg-white/10 text-white/88 hover:bg-white/15"
                      }`}
                    >
                      {acquireState[book.id] === "loading" ? (
                        <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                      ) : acquireState[book.id] === "success" ? (
                        <Check className="h-[18px] w-[18px]" />
                      ) : (
                        <BookOpen className="h-[18px] w-[18px]" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.08 }}
                  className="mt-6 min-h-0 flex-1 overflow-hidden pb-24"
                >
                  <div className="w-full space-y-3">
                    <AnimatePresence mode="popLayout">
                      {visibleLines.map((line, i) => {
                        const lineIndex = visibleStart + i;
                        const age = sceneIndex - lineIndex;
                        const opacity = age === 0 ? 1 : age === 1 ? 0.66 : age === 2 ? 0.42 : 0.24;
                        return (
                          <motion.p
                            key={`${book.id}-${lineIndex}`}
                            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                            animate={{ opacity, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            className="max-w-[92%] text-[24px] leading-[1.6] tracking-[0.01em] text-white"
                          >
                            {line}
                          </motion.p>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              animate={{
                x: detailOpen ? "-100%" : "0%",
                scale: detailOpen ? 1 : 0.992,
                opacity: detailOpen ? 1 : 0.9,
              }}
              transition={panelSpring}
              className="absolute inset-y-0 left-full w-full overflow-hidden bg-black"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${book.bg}`} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.82)_100%)]" />

              <div className="relative flex h-full flex-col px-7 pb-10 pt-8">
                <div
                  ref={detailScrollRef}
                  onWheel={onDetailWheel}
                  onTouchStart={onDetailTouchStart}
                  onTouchMove={onDetailTouchMove}
                  onTouchEnd={onDetailTouchEnd}
                  className="mt-2 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mb-6 pb-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[28px] leading-none text-white">{book.title}</p>
                        <p className="mt-3 text-sm text-white/45">{book.author}</p>
                        <p className="mt-4 max-w-[220px] text-sm leading-6 text-white/62">{book.meta}</p>
                      </div>
                      <div className="flex h-28 w-[84px] shrink-0 items-center justify-center whitespace-pre-line rounded-[24px] border border-white/10 bg-white/5 text-center text-[17px] leading-7 text-white/92 shadow-[0_16px_34px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                        {book.cover}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ scale: 1.02 }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        onClick={() => toggleSave(book.id)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-3 backdrop-blur-sm transition ${
                          savedBooks[book.id]
                            ? "border-white/0 bg-white text-black"
                            : "border-white/10 bg-white/10 text-white/88 hover:bg-white/15"
                        }`}
                      >
                        <motion.div
                          animate={{ scale: savedBooks[book.id] ? 1.08 : 1 }}
                          transition={{ type: "spring", stiffness: 360, damping: 20 }}
                        >
                          <Bookmark
                            className="h-[18px] w-[18px]"
                            fill={savedBooks[book.id] ? "currentColor" : "none"}
                          />
                        </motion.div>
                        <span className="text-sm">{savedBooks[book.id] ? "已收藏" : "收藏"}</span>
                      </motion.button>

                      <motion.button
                        whileTap={acquireState[book.id] === "loading" ? undefined : { scale: 0.92 }}
                        whileHover={acquireState[book.id] === "loading" ? undefined : { scale: 1.02 }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        onClick={() => handleAcquire(book.id)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-3 backdrop-blur-sm transition ${
                          acquireState[book.id] === "success"
                            ? "border-white/0 bg-white text-black"
                            : "border-white/10 bg-white/10 text-white/88 hover:bg-white/15"
                        }`}
                      >
                        {acquireState[book.id] === "loading" ? (
                          <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                        ) : acquireState[book.id] === "success" ? (
                          <Check className="h-[18px] w-[18px]" />
                        ) : (
                          <BookOpen className="h-[18px] w-[18px]" />
                        )}
                        <span className="text-sm">
                          {acquireState[book.id] === "loading"
                            ? "处理中"
                            : acquireState[book.id] === "success"
                              ? "已获取"
                              : "获取"}
                        </span>
                      </motion.button>
                    </div>

                  </motion.section>

                  <div className="mt-3 space-y-7 pb-36">
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.12 }}
                    >
                      <p className="text-[18px] leading-8 text-white">书评</p>

                      <div className="mt-3 space-y-0">
                        {reviewFeed.map((review, i) => (
                          <motion.article
                            key={review.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.04 * i }}
                            className="border-b border-white/10 py-4 last:border-white/0"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm text-white/88">{review.author}</p>
                              <p className="text-[11px] tracking-[0.12em] text-white/28">{review.platform}</p>
                            </div>
                            <p className="mt-3 text-[15px] leading-7 text-white/74">{review.text}</p>
                          </motion.article>
                        ))}
                      </div>
                    </motion.div>

                    {chatThread.length || chatIsLoading ? (
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.18 }}
                        className="space-y-3"
                      >
                        {chatThread.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-[22px] border px-4 py-3 ${
                                message.role === "user"
                                  ? "border-white/10 bg-white/10 text-white/88"
                                  : "border-white/10 bg-black/18 text-white/72"
                              }`}
                            >
                              <p className="text-[11px] tracking-[0.12em] text-white/30">
                                {message.role === "user" ? "你" : "AI"}
                              </p>
                              <p className="mt-2 text-[14px] leading-6">{message.text}</p>
                            </div>
                          </div>
                        ))}

                        {chatIsLoading ? (
                          <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-[22px] border border-white/10 bg-black/18 px-4 py-3 text-white/72">
                              <div className="flex items-center gap-2">
                                <LoaderCircle className="h-[14px] w-[14px] animate-spin text-white/52" />
                                <p className="text-[13px] leading-6 text-white/46">AI 正在整理无剧透回答</p>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </motion.div>
                    ) : null}

                    <motion.div
                      animate={{
                        y: -(previewPullProgress * 8 + previewBreakProgress * 10),
                        opacity: 0.24 + previewPullProgress * 0.34 + previewBreakProgress * 0.24,
                      }}
                      transition={{ type: "spring", stiffness: 280, damping: 30 }}
                      className="pt-2"
                    >
                      <div className="mx-auto flex w-fit flex-col items-center gap-2">
                        <motion.div
                          animate={{
                            width: 26 + previewPullProgress * 20 + previewBreakProgress * 14,
                            opacity: 0.18 + previewPullProgress * 0.36 + previewBreakProgress * 0.2,
                          }}
                          transition={{ type: "spring", stiffness: 280, damping: 30 }}
                          className={`h-[2px] rounded-full ${previewArmed ? book.glow : "bg-white/20"}`}
                        />
                        <p className="text-center text-[11px] tracking-[0.12em] text-white/24">
                          {previewArmed ? "继续下滑，进入前500字试读" : "继续下滑进入前500字试读"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="absolute inset-x-7 bottom-10">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] px-3 py-2 shadow-[0_18px_40px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition focus-within:border-white/18 focus-within:bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)]">
                    <input
                      type="text"
                      value={chatDrafts[book.id] ?? ""}
                      onChange={(e) => handleChatDraftChange(book.id, e.target.value)}
                      onKeyDown={(e) => handleChatKeyDown(e, book.id)}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      placeholder="问问 AI：这本书适合你现在读吗？"
                      className="min-w-0 flex-1 bg-transparent px-2 text-[15px] leading-6 text-white outline-none placeholder:text-white/26"
                    />

                    <motion.button
                      whileTap={chatIsLoading ? undefined : { scale: 0.96 }}
                      whileHover={chatIsLoading ? undefined : { scale: 1.04 }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onClick={() => handleAskBook(book.id)}
                      aria-label="发送问题"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/88 backdrop-blur-sm transition hover:bg-white/15 disabled:cursor-not-allowed disabled:border-white/6 disabled:bg-white/6 disabled:text-white/26"
                      disabled={!(chatDrafts[book.id] ?? "").trim() || chatIsLoading}
                    >
                      {chatIsLoading ? (
                        <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                      ) : (
                        <SendHorizonal className="h-4 w-4 -translate-x-[1px]" />
                      )}
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {previewOpen ? (
                    <motion.div
                      initial={{ y: "100%", opacity: 1 }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute inset-0 z-40 overflow-hidden bg-black"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-b ${book.bg}`} />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.36)_0%,rgba(0,0,0,0.82)_100%)]" />

                      <div className="relative flex h-full flex-col px-7 pb-10 pt-4">
                        <motion.div
                          animate={{
                            height: previewExitHintActive ? 42 : 0,
                            opacity: previewExitHintActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="pointer-events-none overflow-hidden"
                        >
                          <motion.div
                            animate={{
                              y:
                                (previewExitHintActive ? 0 : -10) +
                                previewExitPullProgress * 6 +
                                previewExitBreakProgress * 8,
                            }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="pt-1"
                          >
                            <motion.div
                              animate={{
                                width: 26 + previewExitPullProgress * 20 + previewExitBreakProgress * 14,
                              }}
                              transition={{ type: "spring", stiffness: 280, damping: 30 }}
                              className={`mx-auto h-[2px] rounded-full ${previewExitArmed ? book.glow : "bg-white/32"}`}
                            />

                            <motion.p
                              animate={{
                                y: previewExitPullProgress * 4 + previewExitBreakProgress * 6,
                              }}
                              transition={{ type: "spring", stiffness: 280, damping: 30 }}
                              className="mt-2 text-center text-[11px] tracking-[0.12em] text-white/34"
                            >
                              {previewExitArmed ? "继续上滑，返回详情" : "上滑返回详情"}
                            </motion.p>
                          </motion.div>
                        </motion.div>

                        <div
                          ref={previewScrollRef}
                          onScroll={onPreviewScroll}
                          onWheel={onPreviewWheel}
                          onTouchStart={onPreviewTouchStart}
                          onTouchMove={onPreviewTouchMove}
                          onTouchEnd={onPreviewTouchEnd}
                          className="flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        >
                          <div className="space-y-6 pb-24">
                            {previewContent.map((paragraph, paragraphIndex) => (
                              <p
                                key={`${book.id}-preview-${paragraphIndex}`}
                                className="text-[16px] leading-8 text-white/78"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>

                        <motion.div
                          animate={{
                            y: -(previewAnnaPullProgress * 8 + previewAnnaBreakProgress * 10),
                            opacity: 0.22 + previewAnnaPullProgress * 0.34 + previewAnnaBreakProgress * 0.24,
                          }}
                          transition={{ type: "spring", stiffness: 280, damping: 30 }}
                          className="pt-3"
                        >
                          <div className="mx-auto flex w-fit flex-col items-center gap-2">
                            <motion.div
                              animate={{
                                width: 26 + previewAnnaPullProgress * 20 + previewAnnaBreakProgress * 14,
                                opacity: 0.18 + previewAnnaPullProgress * 0.36 + previewAnnaBreakProgress * 0.2,
                              }}
                              transition={{ type: "spring", stiffness: 280, damping: 30 }}
                              className={`h-[2px] rounded-full ${previewAnnaArmed ? book.glow : "bg-white/20"}`}
                            />
                            <p className="text-center text-[11px] tracking-[0.12em] text-white/28">
                              {previewAnnaArmed
                                ? "继续下滑，进入 Anna's Archive"
                                : "继续下滑进入 Anna's Archive"}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {annaOpen ? (
                    <motion.div
                      initial={{ y: "100%", opacity: 1 }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="absolute inset-0 z-50 overflow-hidden bg-black"
                    >
                      <div className="relative flex h-full flex-col bg-black">
                        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end p-4">
                          <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            onClick={() => setAnnaOpen(false)}
                            aria-label="返回试读"
                            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/52 text-white/88 backdrop-blur-sm transition hover:bg-black/62"
                          >
                            <ArrowLeft className="h-[18px] w-[18px]" />
                          </button>
                        </div>

                        <div className="relative min-h-0 flex-1 bg-white">
                          {annaLoading ? (
                            <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/6 pt-20 backdrop-blur-[2px]">
                              <div className="flex items-center gap-2 rounded-full border border-black/8 bg-white/88 px-4 py-2 text-[13px] text-black/62">
                                <LoaderCircle className="h-[16px] w-[16px] animate-spin" />
                                <span>正在打开 Anna&apos;s Archive</span>
                              </div>
                            </div>
                          ) : null}

                          <iframe
                            title={`${book.title} on Anna's Archive`}
                            src={book.annaUrl}
                            onLoad={() => setAnnaLoading(false)}
                            className="h-full w-full border-0 bg-white"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
