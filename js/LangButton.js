'use strict';

function LangButton()
{
	const button_ja = document.getElementById('lang-ja');
	const button_en = document.getElementById('lang-en');
	const button_zh = document.getElementById('lang-zh');
	let on_changed_handler = null;

	function update()
	{
		// すべてのボタンのaria-pressed属性を更新
		button_ja.setAttribute('aria-pressed', data.lang === 'ja');
		button_en.setAttribute('aria-pressed', data.lang === 'en');
		button_zh.setAttribute('aria-pressed', data.lang === 'zh');

		// 選択状態のアナウンス
		const langNames = {
			'ja': '日本語',
			'en': 'English',
			'zh': '中文'
		};
		
		// スクリーンリーダー用のライブリージョン更新
		announceChange(`言語が${langNames[data.lang]}に変更されました`);

		if (on_changed_handler) {
			on_changed_handler();
		}
	}

	function announceChange(message) {
		// 既存のアナウンスメント要素があれば削除
		const existing = document.getElementById('lang-announcement');
		if (existing) {
			existing.remove();
		}

		// 新しいアナウンスメント要素を作成
		const announcement = document.createElement('div');
		announcement.id = 'lang-announcement';
		announcement.className = 'sr-only';
		announcement.setAttribute('role', 'status');
		announcement.setAttribute('aria-live', 'polite');
		announcement.textContent = message;
		document.body.appendChild(announcement);

		// 3秒後に削除
		setTimeout(() => {
			if (announcement.parentNode) {
				announcement.remove();
			}
		}, 3000);
	}

	function setLanguage(lang) {
		data.lang = lang;
		update();
	}

	this.onchanged = function(f)
	{
		on_changed_handler = f;
	};

	// クリックイベント
	button_ja.addEventListener('click', function() {
		setLanguage('ja');
	});
	
	button_en.addEventListener('click', function() {
		setLanguage('en');
	});
	
	button_zh.addEventListener('click', function() {
		setLanguage('zh');
	});

	// キーボード操作のサポート
	[button_ja, button_en, button_zh].forEach(button => {
		button.addEventListener('keydown', function(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				button.click();
			}
		});
	});

	// 矢印キーでの言語切り替え
	button_ja.addEventListener('keydown', function(e) {
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			button_en.focus();
		}
	});

	button_en.addEventListener('keydown', function(e) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			button_ja.focus();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			button_zh.focus();
		}
	});

	button_zh.addEventListener('keydown', function(e) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			button_en.focus();
		}
	});

	update();
}
