'use strict';

function YearText()
{
	const ganzhi10 = "甲乙丙丁戊已庚辛壬癸";
	const ganzhi12 = "子丑寅卯辰巳午未申酉戌亥";

	const year_text = document.getElementById('year-text');
	const year_input = document.getElementById('year-input');
	const year_text_sub = document.getElementById('year-sub');
	let on_changed_handler = null;

	// 2"nd" century
	function suffix(i)
	{
		if (i >= 10 && i < 20) {
			return 'th';
		}

		switch (i % 10){
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
		}
	}
	
	// 1000年→10th century
	function get_century_text(yr)
	{
		let c;
		if (yr < 0) {
			c = Math.floor((-yr-1) / 100) + 1;
			return c + suffix(c) + ' century BC';
		} else {
			c = Math.floor((yr-1) / 100) + 1;
			return c + suffix(c) + ' century';
		}
	}
	
	// 干支
	function get_ganzhi_text(y)
	{
		if (y < 0) {
			y++;
		}
		y += 8036;
		return ganzhi10.charAt(y % 10) + ganzhi12.charAt(y % 12);
	}
	
	// 元号(末尾に/を付ける)
	function get_era_name(era, year)
	{
		let ret = '';

		for (let i = 0; i < era.length; i++) {
			let er = era[i];
			for (let j = er.length-1; j >= 0; j--) {
				let e = er[j];
				if (year >= e[0]) {
					if (e[1] !== null) {
						ret += e[1] + (year-e[0]+1) + '年 / ';
					}
					break;
				}
			}
		}
		return ret;
	}

	function update_text()
	{
		let mainText = '';
		
		switch (data.lang) {
		case 'ja':
		case 'zh':
			if (data.year < 0) {
				mainText = "前" + (-data.year) + "年";
			} else {
				mainText = data.year + "年";
			}
			break;
		case 'en':
			if (data.year < 0) {
				mainText = (-data.year) + " BC";
			} else {
				mainText = "AD " + data.year;
			}
			break;
		}
		
		year_text.textContent = mainText;
		year_text.setAttribute('aria-label', `現在の年: ${mainText}。クリックして変更`);

		let subText = '';
		switch (data.lang) {
		case 'ja':
			subText = get_era_name(era_jp, data.year) + get_ganzhi_text(data.year);
			break;
		case 'zh':
			subText = get_era_name(era_cn, data.year) + get_ganzhi_text(data.year);
			break;
		case 'en':
			subText = get_century_text(data.year);
			break;
		}
		
		year_text_sub.textContent = subText;
	}

	function show_input() {
		year_text.style.display = 'none';
		year_input.style.display = 'inline-block';
		year_input.value = data.year;
		
		// すぐにフォーカスして選択
		setTimeout(function() {
			year_input.focus();
			year_input.select();
		}, 10);
	}

	function hide_input() {
		year_text.style.display = 'inline-block';
		year_input.style.display = 'none';
	}

	function enter_year_text()
	{
		let text = year_input.value.trim();
		
		// 年が直接入力された場合
		if (text.match(/^-?\d{1,4}$/)) {
			let newYear = Number(text);
			
			// 範囲チェック
			if (newYear < -4000) {
				newYear = -4000;
				alert('年号は紀元前4000年以降を指定してください');
			} else if (newYear === 0) {
				alert('0年は存在しません。紀元前1年または紀元1年を指定してください');
				newYear = 1;
			} else if (newYear > 2019) {
				newYear = 2019;
				alert('年号は2019年以前を指定してください');
			}
			
			data.year = newYear;
			data.year_clamp();
			update_text();
			
			if (on_changed_handler) {
				on_changed_handler();
			}
			
			// 変更をアナウンス
			announceYearChange();
		} else if (text !== '') {
			alert('有効な年号を入力してください（例: 1600, -500）');
		}
		
		hide_input();
	}

	function announceYearChange() {
		const announcement = document.createElement('div');
		announcement.className = 'sr-only';
		announcement.setAttribute('role', 'status');
		announcement.setAttribute('aria-live', 'assertive');
		announcement.textContent = `年が${year_text.textContent}に変更されました`;
		document.body.appendChild(announcement);

		setTimeout(() => {
			if (announcement.parentNode) {
				announcement.remove();
			}
		}, 2000);
	}

	this.update = update_text;

	this.onchanged = function(f)
	{
		on_changed_handler = f;
	};

	// クリックで入力モードへ
	year_text.addEventListener('click', show_input);

	// Enterキーでも入力モードへ
	year_text.addEventListener('keydown', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			show_input();
		}
	});

	// フォーカスが外れたら確定
	year_input.addEventListener('blur', enter_year_text);
	
	// Enterキーで確定
	document.getElementById('year').addEventListener('submit', function(e) {
		e.preventDefault();
		enter_year_text();
	});

	// Escキーでキャンセル
	year_input.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			hide_input();
			year_text.focus();
		}
	});

	this.update();
}
