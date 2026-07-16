import type { Subject } from './types';

/**
 * Single source of Subject content for the Portfolio Site.
 * Opening Copy is the long self-description (hero long body), not a separate About paragraph.
 */
export const subject: Subject = {
  displayName: '19y',
  roleLine: '高级嵌入式与物联网研发工程师。',
  openingCopy:
    '打破架构界限，创造纯粹性能与动态体系的双刃之剑。在这里，\n' +
    '底层思维不再是死板的寄存器与指针堆砌，而是如同电子脉冲一样\n' +
    '极速穿轨的精密操控艺术。\n\n' +
    '致力于将极度的硬件克制与软件张力，完美融合在每一组时序代码的缝隙之中。',
  focusTags: [
    { label: 'STM32', variant: 'yellow' },
    { label: 'RTOS', variant: 'pink' },
    { label: 'IoT', variant: 'cyan' },
  ],
  skillGroups: [
    {
      title: '核心语言与脚本',
      variant: 'a',
      points: [
        {
          text: '熟悉 <strong>C 语言</strong>，深入了解链接脚本与堆栈优化。',
        },
        {
          text:
            '熟练使用 <strong>Python</strong> 进行嵌入式辅助脚本开发与上位机工具编写（如运用 PyQt 构建数据监控终端）。',
        },
      ],
    },
    {
      title: 'MCU与中间件架构',
      variant: 'b',
      points: [
        {
          text: '熟练掌握 <strong>STM32F1/F4 系列 MCU</strong> 底层架构与外设驱动开发。',
        },
        {
          text:
            '深入运用于实际项目的中间件层：<strong>FreeRTOS、LwIP、FatFS、LVGL。</strong>',
        },
      ],
    },
    {
      title: '通信协议栈与物联网',
      variant: 'c',
      points: [
        {
          text: '具备完整的 <strong>Modbus-RTU</strong> 主站系统设计经验。',
        },
        {
          text:
            '熟练各类硬件通信时序：<strong>USART、RS485、SPI、I²C、One-Wire</strong>。',
        },
        {
          text: '熟练使用 <strong>MQTT (Paho)</strong> 协议构建物联网上云链路。',
        },
      ],
    },
    {
      title: '硬件生态与开发工具链',
      variant: 'd',
      points: [
        {
          text:
            '<strong>环境配置:</strong> Keil5, IAR EWARM, STM32CubeMX/IDE, 或现代 <strong>CLion + CMake + GCC/Clang</strong> 交叉编译架构。',
        },
        {
          text:
            '<strong>硬件设计:</strong> 具备双层 PCB 设计经验（基于嘉立创EDA），熟悉低功耗设计与高速 ADC/DMA 采集优化。',
        },
        {
          text: '<strong>工程化:</strong> 熟练使用 Git 进行现代敏捷版本控制。',
        },
      ],
    },
  ],
  projects: [
    {
      title: '基于 Modbus RTU 的数据采集系统',
      period: '2025.07 - 至今',
      role: '独立项目',
      highlights: [
        '基于 STM32F4 平台跨阶层移植 FreeRTOS 与 LwIP 协议栈，赋予多任务并行与以太网互联能力。',
        '破局底层瓶颈：支持多达 255 个从站配置，通过定制帧间隔调整结合全 DMA 自动传输机制，在繁重的数据采集时段实测 CPU 占用率极度碾压在 <5%。',
        '生态结合：深度集成 Paho-MQTT 客户端打通上云壁垒，整合 FatFS 实现本地灾备备份。',
        '跨界 GUI：使用 C/LVGL 构建下位机屏幕体系，完美结合 Python/PyQt 撰写的高级上位仪表台。',
      ],
    },
    {
      title: '物联网共享充电宝架构',
      period: '2025.01 - 2025.03',
      role: '团队核心研发',
      highlights: [
        '底层驱动：打通 USART 配合异步双通道 DMA，架设 STM32 至 ESP8266 高速桥梁，MQTT 延迟测定 < 100 ms。',
        '极致算法：在宽泛室内环境中，搭载多极校准与非线性滤波，电量监测误差压制 <1%。',
        '功耗压榨：重构超低功耗休眠唤醒事件链，结合 ATGM336H GPS，生生延长 30% 续航。',
        '系统鲁棒性：断电无感重连拓扑及云端日志遥感系统，基站掉线频率下探超 60%。',
      ],
    },
    {
      title: '基于 STM32F1 的异构点阵屏控制卡',
      period: '2024.07 - 2024.09',
      role: '独立项目',
      highlights: [
        '时序操控：榨干 F1 底线，凭借 DMA+GPIO+PWM 完美模拟 HUB75E 协议时序，单核直驱全彩屏锁屏 60 FPS。',
        '万物互联：原生 DHT11 温湿度传感体系以及 Wi-Fi 芯片，构建无感 Web 近场配网与网络授时 (±100ms 级别)。',
        '美学环保：自动光敏刷新策略模型，全链功耗断崖式削减 25%。',
      ],
    },
  ],
  awards: [
    {
      title: '第九届全国大学生集成电路创新创业大赛',
      result: '全国一等奖',
    },
    {
      title: '第五届全国大学生计算机能力挑战赛(C/C++赛道)',
      result: '全国一等奖',
    },
    {
      title: '2025 年江西省职业院校技能大赛（物联网应用开发赛项）',
      result: '省级一等奖',
    },
    {
      title: '第十六届蓝桥杯全国软件和信息技术专业人才大赛（嵌入式设计与开发赛道）',
      result: '全国二等奖',
    },
  ],
  credentials: [
    { title: '全国大学生国家奖学金' },
    { title: '物联网安装调试员（技师级）' },
    { title: '照明工程施工员（高级工）' },
    { title: '大学生英语四级等级资格' },
  ],
};
