import { prepareWithSegments, layoutNextLine, materializeLineRange, layoutWithLines, type LayoutCursor } from '@chenglou/pretext';

window.addEventListener('error', (e) => {
  console.error("Uncaught runtime error:", e.error);
});

// 1. Mouse interactions
let mouseX = -1000;
let mouseY = -1000;
let lastMouseX = -1000;
let lastMouseY = -1000;
let isResized = true;

const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
};
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('resize', () => { isResized = true; });

// --- Resume Core Text Data ---
const slogan = "19y.\n\n" +
  "高级嵌入式与物联网研发工程师。\n\n" +
  "打破架构界限，创造纯粹性能与动态体系的双刃之剑。在这里，\n" +
  "底层思维不再是死板的寄存器与指针堆砌，而是如同电子脉冲一样\n" +
  "极速穿轨的精密操控艺术。\n\n" + 
  "致力于将极度的硬件克制与软件张力，完美融合在每一组时序代码的缝隙之中。";

const projects = [
  "【基于 Modbus RTU 的数据采集系统】 (2025.07 - 至今) · 独立项目\n" +
  "• 基于 STM32F4 平台跨阶层移植 FreeRTOS 与 LwIP 协议栈，赋予多任务并行与以太网互联能力。\n" +
  "• 破局底层瓶颈：支持多达 255 个从站配置，通过定制帧间隔调整结合全 DMA 自动传输机制，在繁重的数据采集时段实测 CPU 占用率极度碾压在 <5%。\n" +
  "• 生态结合：深度集成 Paho-MQTT 客户端打通上云壁垒，整合 FatFS 实现本地灾备备份。\n" +
  "• 跨界 GUI：使用 C/LVGL 构建下位机屏幕体系，完美结合 Python/PyQt 撰写的高级上位仪表台。",

  "【物联网共享充电宝架构】 (2025.01 - 2025.03) · 团队核心研发\n" +
  "• 底层驱动：打通 USART 配合异步双通道 DMA，架设 STM32 至 ESP8266 高速桥梁，MQTT 延迟测定 < 100 ms。\n" +
  "• 极致算法：在宽泛室内环境中，搭载多极校准与非线性滤波，电量监测误差压制 <1%。\n" +
  "• 功耗压榨：重构超低功耗休眠唤醒事件链，结合 ATGM336H GPS，生生延长 30% 续航。\n" +
  "• 系统鲁棒性：断电无感重连拓扑及云端日志遥感系统，基站掉线频率下探超 60%。",

  "【基于 STM32F1 的异构点阵屏控制卡】 (2024.07 - 2024.09) · 独立项目\n" +
  "• 时序操控：榨干 F1 底线，凭借 DMA+GPIO+PWM 完美模拟 HUB75E 协议时序，单核直驱全彩屏锁屏 60 FPS。\n" +
  "• 万物互联：原生 DHT11 温湿度传感体系以及 Wi-Fi 芯片，构建无感 Web 近场配网与网络授时 (±100ms 级别)。\n" +
  "• 美学环保：自动光敏刷新策略模型，全链功耗断崖式削减 25%。"
];

const awards = "🏆 顶级荣誉墙 与 专业技能认证\n" +
  "--------------------------------------------------\n" +
  "🥇 赛事奖励：\n" +
  "  • 第九届全国大学生集成电路创新创业大赛 — [全国一等奖]\n" +
  "  • 第五届全国大学生计算机能力挑战赛(C/C++赛道) — [全国一等奖]\n" +
  "  • 2025 年江西省职业院校技能大赛（物联网应用开发赛项） — [省级一等奖]\n" +
  "  • 第十六届蓝桥杯全国软件和信息技术专业人才大赛（嵌入式设计与开发赛道） — [全国二等奖]\n\n" +
  "📙 权威凭证：\n" +
  "  • 全国大学生国家奖学金\n" +
  "  • 物联网安装调试员（技师级）\n" +
  "  • 照明工程施工员（高级工）\n" +
  "  • 大学生英语四级等级资格";

// --- Hero Canvas setup ---
const canvasHero = document.getElementById('pretext-hero') as HTMLCanvasElement;
const ctxHero = canvasHero.getContext('2d')!;
let heroPrepared: any;

const renderHeroDynamic = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  
  if (isResized || !heroPrepared) {
    canvasHero.width = w * window.devicePixelRatio;
    canvasHero.height = h * window.devicePixelRatio;
    ctxHero.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    
    const isMobile = w < 768;
    const heroFontSize = isMobile ? '24px' : '36px';
    heroPrepared = prepareWithSegments(slogan, `800 ${heroFontSize} "Outfit", sans-serif`, { whiteSpace: 'pre-wrap' });
  }
  
  const containerWidth = Math.min(w * 0.85, 1200);   
  const startX = (w - containerWidth) / 2;
  const lineHeight = w < 768 ? 44 : 56;
  const MAGIC_ESTIMATED_HEIGHT = 10 * lineHeight; 
  const startY = (h - MAGIC_ESTIMATED_HEIGHT) / 2;

  ctxHero.clearRect(0, 0, w, h);
  ctxHero.textAlign = 'left';
  ctxHero.textBaseline = 'top';

  const AVOID_RADIUS = 280; 

  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let currentY = startY;

  while (true) {
    const centerLineY = currentY + lineHeight / 2;
    const dy = Math.abs(centerLineY - mouseY);

    let spans: {x: number, w: number}[] = [ {x: startX, w: containerWidth} ];

    if (dy < AVOID_RADIUS) {
       const dx = Math.sqrt(AVOID_RADIUS * AVOID_RADIUS - dy * dy);
       const cutoutLeft = mouseX - dx;
       const cutoutRight = mouseX + dx;
       
       spans = [];
       if (cutoutLeft > startX) {
         const leftFragWidth = cutoutLeft - startX;
         if (leftFragWidth > 60) { 
            spans.push({ x: startX, w: leftFragWidth });
         }
       }
       if (cutoutRight < startX + containerWidth) {
         const rightFragWidth = (startX + containerWidth) - cutoutRight;
         if (rightFragWidth > 60) {
            spans.push({ x: cutoutRight, w: rightFragWidth });
         }
       }
    }

    let exhausted = false;
    for (let i = 0; i < spans.length; i++) {
       const span = spans[i];
       const line = layoutNextLine(heroPrepared, cursor, span.w);
       if (!line) {
         exhausted = true; 
         break;
       }
       
       cursor = line.end;

       const gradient = ctxHero.createLinearGradient(span.x, 0, span.x + span.w, 0);
       gradient.addColorStop(0, '#ffffff');
       gradient.addColorStop(1, '#38bdf8'); // Tech Sky Blue
       
       ctxHero.shadowColor = 'rgba(14, 165, 233, 0.4)';
       ctxHero.shadowBlur = 12;
       ctxHero.fillStyle = gradient;
       ctxHero.font = `800 ${w < 768 ? '24px' : '36px'} "Outfit", sans-serif`;
       ctxHero.fillText(line.text, span.x, currentY);
       ctxHero.shadowBlur = 0;
    }
    
    if (exhausted) break;
    currentY += lineHeight;
    
    if (currentY > h + 1000) break;
  }
};


const renderSections = () => {
  try {
    const cvsProj = document.getElementById('pretext-projects') as HTMLCanvasElement;
    if (!cvsProj) return;
    const ctxProj = cvsProj.getContext('2d')!;

    const containerW = cvsProj.parentElement!.clientWidth || window.innerWidth;
    const w = window.innerWidth;
    const isMobile = w < 768;
    const projFontStr = isMobile ? '300 16px "Inter", sans-serif' : '300 18.5px "Inter", sans-serif';
    const marginW = isMobile ? 20 : 40;
    const cardW = containerW; 
    const textW = Math.max(cardW - marginW * 2, 200); 
    const projLineH = isMobile ? 26 : 34;
    
    const preparedProjects = projects.map(p => prepareWithSegments(p, projFontStr, { whiteSpace: 'pre-wrap' }));
    const layouts = preparedProjects.map((p) => layoutWithLines(p, textW, projLineH));
    
    let requiredHeight = layouts.reduce((acc, l) => acc + l.height + 80, 0);
    
    cvsProj.width = containerW * window.devicePixelRatio;
    cvsProj.height = requiredHeight * window.devicePixelRatio;
    cvsProj.style.width = `${containerW}px`;
    cvsProj.style.height = `${requiredHeight}px`;
    ctxProj.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    ctxProj.clearRect(0, 0, containerW, requiredHeight);

    let currentY = 0;
    layouts.forEach((layout, index) => {
      const cardHeight = layout.height + 60; 
      
      ctxProj.fillStyle = 'rgba(15, 15, 15, 0.4)';
      ctxProj.beginPath();
      ctxProj.roundRect(0, currentY, cardW, cardHeight, 16);
      ctxProj.fill();

      const cardGrad = ctxProj.createLinearGradient(0, currentY, cardW, currentY + cardHeight);
      cardGrad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      cardGrad.addColorStop(1, 'rgba(14, 165, 233, 0.05)'); // Sky-Blue tint
      ctxProj.strokeStyle = cardGrad;
      ctxProj.lineWidth = 1;
      ctxProj.stroke();

      ctxProj.textAlign = 'left';
      ctxProj.textBaseline = 'top';

      for(let i=0; i<layout.lines.length; i++) {
         let lineTxt = layout.lines[i].text;
         let yPos = currentY + 30 + i * projLineH;
         
         if (lineTxt.includes('【')) {
            ctxProj.fillStyle = '#ffffff';
            ctxProj.font = isMobile ? '600 17.5px "Inter", sans-serif' : '700 21px "Inter", sans-serif';
         } else if (lineTxt.trim().startsWith('•')) {
            ctxProj.fillStyle = '#cccccc';
            ctxProj.font = projFontStr;
         } else {
            ctxProj.fillStyle = '#999999';
            ctxProj.font = projFontStr;
         }
         ctxProj.fillText(lineTxt, marginW, yPos);
      }
      currentY += cardHeight + 30; 
    });
    
    const cvsAwd = document.getElementById('pretext-awards') as HTMLCanvasElement;
    if (!cvsAwd) return;
    const ctxAwd = cvsAwd.getContext('2d')!;
    
    const awdFontStr = isMobile ? '400 16px "Inter", sans-serif' : '400 20px "Inter", sans-serif';
    const preparedAwards = prepareWithSegments(awards, awdFontStr, { whiteSpace: 'pre-wrap' });
    const awdLayout = layoutWithLines(preparedAwards, textW, isMobile ? 30 : 42);
    
    const awdHeight = awdLayout.height + 80;
    cvsAwd.width = containerW * window.devicePixelRatio;
    cvsAwd.height = awdHeight * window.devicePixelRatio;
    cvsAwd.style.width = `${containerW}px`;
    cvsAwd.style.height = `${awdHeight}px`;
    ctxAwd.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    ctxAwd.clearRect(0, 0, containerW, awdHeight);
    
    const awdGrad = ctxAwd.createLinearGradient(0, 0, 0, awdHeight);
    awdGrad.addColorStop(0, 'rgba(14, 165, 233, 0.08)');
    awdGrad.addColorStop(1, 'rgba(10, 10, 10, 0.01)');
    
    ctxAwd.fillStyle = awdGrad;
    ctxAwd.beginPath();
    ctxAwd.roundRect(0, 0, cardW, awdHeight, 16);
    ctxAwd.fill();
    
    ctxAwd.strokeStyle = 'rgba(14, 165, 233, 0.3)';
    ctxAwd.lineWidth = 1;
    ctxAwd.stroke();
    ctxAwd.textBaseline = 'top';

    for(let i=0; i<awdLayout.lines.length; i++) {
       let lineText = awdLayout.lines[i].text;
       if (lineText.includes('奖') || lineText.trim().startsWith('🏆')) {
          ctxAwd.fillStyle = '#bae6fd'; // sky-200 Light Cyan
          ctxAwd.font = isMobile ? '700 17.5px "Inter", sans-serif' : '700 21.5px "Inter", sans-serif';
       } else {
          ctxAwd.fillStyle = '#b3b3b3';
          ctxAwd.font = awdFontStr;
       }
       ctxAwd.fillText(lineText, marginW, 40 + i * (isMobile ? 30 : 42));
    }
  } catch (err) {
    console.error("Sections render error:", err);
  }
};


const gameLoop = () => {
  if (isResized || lastMouseX !== mouseX || lastMouseY !== mouseY) {
    renderHeroDynamic();
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    if (isResized) {
      renderSections();
      isResized = false;
    }
  }
  requestAnimationFrame(gameLoop);
};

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const fadePoint = window.innerHeight * 0.9;
  const opacity = Math.max(0, 1 - (scrollY / fadePoint));
  if (canvasHero) {
     canvasHero.style.opacity = String(opacity);
  }
  document.querySelectorAll('.fade-in').forEach(el => {
     const rect = el.getBoundingClientRect();
     if (rect.top < window.innerHeight * 0.85) {
       el.classList.add('visible');
     }
  });
});

setTimeout(() => {
  if (document.fonts) {
     document.fonts.ready.then(() => { 
        isResized = true; 
        requestAnimationFrame(gameLoop);
     });
  } else {
     isResized = true;
     requestAnimationFrame(gameLoop);
  }
  window.dispatchEvent(new Event('scroll'));
}, 100);
