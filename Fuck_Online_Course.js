// ==UserScript==
// @name         Fuck Online Courses Official Version
// @namespace    https://chikie920.github.io/
// @version      1.5
// @description  摸鱼是第一生产力
// @author       Chikie
// @match        http://172-17-1-200-8080-p.webvpn.wbu.edu.cn:8118/integration/v2/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==


'use strict'

// Settings
let begin = 0;
let counts;
let default_wait_time = 10;
let remind_time = 30;
let url_one = /courseOutlineStudent/i;
let url_two = /courseDetailStudent/i;
let url_three = /studyCenter/i;

function fuck_online_course() {
    let url = window.location.href;
    if(url_one.test(url)){
        let check_load = setInterval(() => {
            if(check_load_one()){
                clearInterval(check_load);
                get_list();
            }
        }, 2000);
    }

    if(url_two.test(url)){
        let check_load = setInterval(() => {
            if(check_load_two()){
                clearInterval(check_load);
                wait_a_minute();
            }
        }, 2000);
    }

    if(url_three.test(url)){
        init();
    }
}

fuck_online_course();

function init() {
    GM_deleteValue('i');
    GM_deleteValue('counts');
}


function volume() {
    let target = document.getElementsByClassName('volume-bar')[0].style.width;
    if(target != '0%'){
        document.getElementsByClassName('volume-button volume-icon')[0].click()
    }
}

function remove_judge() {
    let item = document.getElementById('myModal3');
    item.parentNode.removeChild(item);
    unsafeWindow.window.ins.pause = undefined;
}

function start_study() {
    let flag = 0;
    let button = document.getElementsByClassName('btn btn-primary btn-sm handleBtn')[0];
    button.click();
    let check_load = setInterval(() => {
        if(check_load_three() && document.getElementsByClassName('xdyplayer dplayer-loading').length == 0){
            // unsafeWindow.window.ins.play();
            flag = 1;
            remove_judge();
            volume();
            unsafeWindow.goPaly();
            clearInterval(check_load);
        }
    }, 2000);

    let back_to_list = setInterval(() => {
        if(document.getElementById('remainingTime').innerHTML != '00:00' && document.getElementsByClassName('play-played')[0].style.width == '100%'){
            document.getElementsByClassName('play-played')[0].click();
            unsafeWindow.goPaly();
        }
        if(flag == 1 && document.getElementById('remainingTime').innerHTML == '00:00'){
            // unsafeWindow.saveVideoRecord(0);
            document.getElementsByClassName('backLink pull-right')[0].click();
            clearInterval(back_to_list);
        }
    }, remind_time*1000);
    
}

function get_time() {
    let time = document.getElementById('remainingTime').innerHTML;
    time = (Number(time[0])*10 + Number(time[1]))*60 + Number(time[3])*10 + Number(time[4]);
    return time;
}

let i = GM_getValue('i', begin);

function get_list() {
    let video_lists = document.getElementsByClassName('panel-body')[0];
    counts = video_lists.childElementCount;
    video_lists.children[i++].children[1].click();
    GM_setValue('i', i);
}

function wait_a_minute() {
    if(document.getElementsByClassName('fyj_status_span').length == 1 && document.getElementsByClassName('fyj_status_span')[0].innerHTML == '已完成'){ 
        document.getElementsByClassName('backLink pull-right')[0].click();
    } else {
        start_study();
    }
}


function check_load_one() {
    return (document.getElementsByClassName('fyj_loading text-center hide').length != 0 && document.getElementsByClassName('panel-body')[0] != undefined);
}

function check_load_two() {
    return (document.getElementsByClassName('fyj_loading text-center hide').length != 0 && document.getElementsByClassName('btn btn-primary btn-sm handleBtn')[0] != undefined);
}

function check_load_three() {
    return document.getElementsByClassName('play-area clearfix hide').length == 0;
}