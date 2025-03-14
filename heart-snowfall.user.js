// ==UserScript==
// @name         红色爱心飘落效果
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在网页上添加红色爱心飘落效果
// @author       Anthony
// @match        http://*/*
// @match        https://*/*
// @exclude      *://*.youtube.com/*
// @exclude      *://*.netflix.com/*
// @exclude      *://*.bilibili.com/video/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    
    // 检查页面是否包含文本或图片内容
    function shouldShowHearts() {
        const textContent = document.body.textContent.trim();
        const images = document.getElementsByTagName('img');
        return textContent.length > 100 || images.length > 0;
    }

    // 如果页面不符合条件，直接返回
    if (!shouldShowHearts()) {
        return;
    }

    // 添加样式
    const css = `
        .heart-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999999;
            mix-blend-mode: normal;
        }
        
        .heart {
            position: absolute;
            color: #FF0000;
            font-size: 20px;
            text-shadow: 0 0 3px rgba(255, 0, 0, 0.5);
            pointer-events: none;
            user-select: none;
            animation: fall linear;
        }
        
        @keyframes fall {
            0% {
                transform: translate(var(--start-x), var(--start-y));
                opacity: 1;
            }
            100% {
                transform: translate(var(--end-x), var(--end-y));
                opacity: 0.2;
            }
        }
    `;
    
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // 创建容器
    const container = document.createElement('div');
    container.className = 'heart-container';
    document.body.appendChild(container);

    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤';
        
        // 随机起始位置（考虑滚动位置）
        const startX = Math.random() * document.documentElement.scrollWidth;
        const startY = window.pageYOffset - 50 + Math.random() * window.innerHeight * 0.3;
        heart.style.setProperty('--start-x', `${startX}px`);
        heart.style.setProperty('--start-y', `${startY}px`);
        
        // 随机结束位置
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = startY + window.innerHeight + 100;
        heart.style.setProperty('--end-x', `${endX}px`);
        heart.style.setProperty('--end-y', `${endY}px`);
        
        // 调整大小范围（改为更小的尺寸：8-16像素）
        const size = 8 + Math.random() * 8;
        heart.style.fontSize = `${size}px`;
        
        // 增加动画持续时间（6-12秒）
        const duration = 6 + Math.random() * 6;
        heart.style.animationDuration = duration + 's';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    function startHeartFall() {
        // 增加初始创建数量到10个
        for(let i = 0; i < 10; i++) {
            setTimeout(createHeart, i * 300);
        }
        
        // 增加最大同时显示的爱心数量到20个
        setInterval(() => {
            if (document.querySelectorAll('.heart').length < 20) {
                createHeart();
            }
        }, 800); // 缩短创建间隔

        // 增加滚动时创建爱心的概率到30%
        window.addEventListener('scroll', () => {
            if (Math.random() < 0.3) {
                createHeart();
            }
        });
    }

    // 页面加载完成后启动效果
    if (document.readyState === 'complete') {
        startHeartFall();
    } else {
        window.addEventListener('load', startHeartFall);
    }
})(); 