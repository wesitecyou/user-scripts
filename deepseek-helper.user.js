// ==UserScript==
// @name         DeepSeek助手
// @namespace    https://github.com/wesitecyou/user-scripts
// @version      2025-04-17
// @description  动态适配不同错误模式的自动重试，自动重试，重新生成回答
// @author       wesitecyou
// @match        *://*.deepseek.com/*
// @icon         https://chat.deepseek.com/favicon.svg
// @grant        none
// @license      GPL-3.0
// @downloadURL  https://github.com/wesitecyou/user-scripts/raw/refs/heads/main/deepseek-helper.user.js
// @updateURL    https://github.com/wesitecyou/user-scripts/raw/refs/heads/main/deepseek-helper.user.js
// ==/UserScript==
 
// 首次重试
(function() {
    'use strict';
 
    // 配置检测频率
    const CHECK_INTERVAL = 5000;
    const DEBUG_MODE = true;
 
    // 错误模式配置
    const ERROR_PATTERNS = [
        { // 模式1
            errorPath: "./div[2]/p[contains(text(),'服务器繁忙，请稍后再试。')]",
            buttonPath: "./div[3]/div[1]/div[2]"
        },
        { // 模式2
            errorPath: "./div[3]/p[contains(text(),'服务器繁忙，请稍后再试。')]",
            buttonPath: "./div[4]/div[1]/div[2]"
        }
    ];
 
    const logger = {
        log: (msg) => console.log(`%c[DeepSeek助手] ${new Date().toLocaleTimeString()} ${msg}`, 'color: #2196F3;'),
        warn: (msg) => console.warn(`%c[DeepSeek助手] ${new Date().toLocaleTimeString()} ${msg}`, 'color: #FF9800;'),
        error: (msg) => console.error(`%c[DeepSeek助手] ${new Date().toLocaleTimeString()} ${msg}`, 'color: #f44336;')
    };
 
    // 容器路径生成
    const CONTAINER_PATH = [
        "div[1]", "div[2]", "div[2]", "div[1]",
        "div[2]", "div[1]", "div[1]", "div[1]",
        "div[last()]"
    ];
 
    const getTargetContainer = () => {
        const basePath = "//div[@id='root']";
        const fullPath = CONTAINER_PATH.reduce((acc, cur) => `${acc}/${cur}`, basePath);
 
        const container = document.evaluate(
            fullPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
 
        DEBUG_MODE && logger.log(container ?
            '✅ 容器定位成功' : '⚠️ 容器暂未找到');
        return container;
    };
 
    // 错误模式检测
    const detectErrorPattern = (container) => {
        for (let i = 0; i < ERROR_PATTERNS.length; i++) {
            const errorElem = document.evaluate(
                ERROR_PATTERNS[i].errorPath,
                container,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
 
            if (errorElem) {
                DEBUG_MODE && logger.log(`识别到模式 ${i+1} 错误`);
                return ERROR_PATTERNS[i];
            }
        }
        return null;
    };
 
    // 重试按钮查找
    const findDynamicButton = (container, pattern) => {
        const btn = document.evaluate(
            pattern.buttonPath,
            container,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
 
        if (btn) {
            DEBUG_MODE && logger.log(`定位到模式${ERROR_PATTERNS.indexOf(pattern)+1}按钮`);
            return btn;
        }
        DEBUG_MODE && logger.warn('按钮定位失败');
        return null;
    };
 
    const check = () => {
        DEBUG_MODE && logger.log('\n------ 首次重试检测开始 ------');
 
        const container = getTargetContainer();
        if (!container) return;
 
        const errorPattern = detectErrorPattern(container);
        if (!errorPattern) {
            DEBUG_MODE && logger.log('✅ 首次重试状态正常');
            return;
        }
 
        const btn = findDynamicButton(container, errorPattern);
        if (btn) {
            logger.log(`🔄 触发 ${errorPattern.buttonPath} 重试`);
            btn.click();
        }
 
        DEBUG_MODE && logger.log('------ 首次重试检测结束 ------');
    };
 
    // 初始化
    logger.log('DeepSeek助手脚本已激活');
    logger.log(`配置检测模式：${ERROR_PATTERNS.length}种`);
    setInterval(check, CHECK_INTERVAL);
})();
 
// 后续重试
(function() {
    'use strict';
 
    // 配置检测频率
    const CHECK_INTERVAL = 5000;
    const DEBUG_MODE = true;
 
    // 错误模式配置
    const ERROR_PATTERNS = [
        { // 模式1
            errorPath: "./div[2]/p[contains(text(),'服务器繁忙，请稍后再试。')]",
            buttonPath: "./div[3]/div[2]/div[2]"
        },
        { // 模式2
            errorPath: "./div[3]/p[contains(text(),'服务器繁忙，请稍后再试。')]",
            buttonPath: "./div[4]/div[2]/div[2]"
        }
    ];
 
    const logger = {
        log: (msg) => console.log(`%c[DeepSeek助手] ${new Date().toLocaleTimeString()} ${msg}`, 'color: #2196F3;'),
        warn: (msg) => console.warn(`%c[DeepSeek助手] ${new Date().toLocaleTimeString()} ${msg}`, 'color: #FF9800;'),
        error: (msg) => console.error(`%c[DeepSeek助手] ${new Date().toLocaleTimeString()} ${msg}`, 'color: #f44336;')
    };
 
    // 容器路径生成
    const CONTAINER_PATH = [
        "div[1]", "div[2]", "div[2]", "div[1]",
        "div[2]", "div[1]", "div[1]", "div[1]",
        "div[last()]"
    ];
 
    const getTargetContainer = () => {
        const basePath = "//div[@id='root']";
        const fullPath = CONTAINER_PATH.reduce((acc, cur) => `${acc}/${cur}`, basePath);
 
        const container = document.evaluate(
            fullPath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
 
        DEBUG_MODE && logger.log(container ?
            '✅ 容器定位成功' : '⚠️ 容器暂未找到');
        return container;
    };
 
    // 错误模式检测
    const detectErrorPattern = (container) => {
        for (let i = 0; i < ERROR_PATTERNS.length; i++) {
            const errorElem = document.evaluate(
                ERROR_PATTERNS[i].errorPath,
                container,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
 
            if (errorElem) {
                DEBUG_MODE && logger.log(`识别到模式 ${i+1} 错误`);
                return ERROR_PATTERNS[i];
            }
        }
        return null;
    };
 
    // 重试按钮查找
    const findDynamicButton = (container, pattern) => {
        const btn = document.evaluate(
            pattern.buttonPath,
            container,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
 
        if (btn) {
            DEBUG_MODE && logger.log(`定位到模式${ERROR_PATTERNS.indexOf(pattern)+1}按钮`);
            return btn;
        }
        DEBUG_MODE && logger.warn('按钮定位失败');
        return null;
    };
 
    const check = () => {
        DEBUG_MODE && logger.log('\n------ 后续重试检测开始 ------');
 
        const container = getTargetContainer();
        if (!container) return;
 
        const errorPattern = detectErrorPattern(container);
        if (!errorPattern) {
            DEBUG_MODE && logger.log('✅ 后续重试状态正常');
            return;
        }
 
        const btn = findDynamicButton(container, errorPattern);
        if (btn) {
            logger.log(`🔄 触发 ${errorPattern.buttonPath} 重试`);
            btn.click();
        }
 
        DEBUG_MODE && logger.log('------ 后续重试检测结束 ------');
    };
 
    // 初始化
    logger.log('DeepSeek助手脚本已激活');
    logger.log(`配置检测模式：${ERROR_PATTERNS.length}种`);
    setInterval(check, CHECK_INTERVAL);
})();