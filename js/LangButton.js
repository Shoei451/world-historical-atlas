'use strict';

function LangButton()
{
	const button_ja = document.getElementById('lang-ja');
	const button_en = document.getElementById('lang-en');
	let on_changed_handler = null;

	function update()
	{
		switch (data.lang) {
		case 'ja':
			button_ja.innerText = '日本語';
			button_en.innerText = '英語';
			button_ja.style.fontWeight = 'bold';
			button_en.style.fontWeight = '';
			break;
		case 'en':
			button_ja.innerText = 'Japanese';
			button_en.innerText = 'English';
			button_ja.style.fontWeight = '';
			button_en.style.fontWeight = 'bold';
			break;
		}
		if (on_changed_handler) {
			on_changed_handler();
		}
	}

	this.onchanged = function(f)
	{
		on_changed_handler = f;
	};

	button_ja.addEventListener('mousedown', function()
	{
		data.lang = 'ja';
		update();
	});
	button_en.addEventListener('mousedown', function()
	{
		data.lang = 'en';
		update();
	});

	update();
}
