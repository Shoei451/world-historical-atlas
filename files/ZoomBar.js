'use strict';

function ZoomBar()
{
	const zoom_bar = document.getElementById('scale-zoom');
	const cursor = document.getElementById('scale-zoom-cursor');
	let on_changed_handler = null;

	// 「つまみ」を動かす
	function update_cursor()
	{
		const leftPos = 101 - data.zoom * 16;
		cursor.style.left = leftPos + 'px';
		
		// ARIA属性を更新
		zoom_bar.setAttribute('aria-valuenow', data.zoom);
		
		// ズームレベルの説明
		const zoomLabels = ['最小', '小', '中', '大', '最大'];
		zoom_bar.setAttribute('aria-valuetext', `ズームレベル ${zoomLabels[data.zoom]}`);
	}
	
	function zoom_limit()
	{
		if (data.zoom < 0) {
			data.zoom = 0;
		} else if (data.zoom > 4) {
			data.zoom = 4;
		}
	}

	function setZoom(newZoom) {
		data.zoom = newZoom;
		zoom_limit();
		update_cursor();
		
		if (on_changed_handler) {
			on_changed_handler();
		}
		
		announceZoomChange();
	}

	function announceZoomChange() {
		const zoomLabels = ['最小', '小', '中', '大', '最大'];
		const announcement = document.createElement('div');
		announcement.className = 'sr-only';
		announcement.setAttribute('role', 'status');
		announcement.setAttribute('aria-live', 'polite');
		announcement.textContent = `ズームレベルが${zoomLabels[data.zoom]}に変更されました`;
		document.body.appendChild(announcement);

		setTimeout(() => {
			if (announcement.parentNode) {
				announcement.remove();
			}
		}, 2000);
	}

	this.update = update_cursor;

	this.onchanged = function(f)
	{
		on_changed_handler = f;
	};

	// マウスクリック
	zoom_bar.addEventListener('click', function(e)
	{
		// マウス座標からつまみ位置を求める
		const rect = zoom_bar.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const newZoom = Math.floor((116 - clickX) / 16);
		setZoom(newZoom);
	});

	// キーボード操作
	zoom_bar.addEventListener('keydown', function(e) {
		let handled = false;
		
		switch(e.key) {
			case 'ArrowRight':
			case 'ArrowUp':
				// ズームイン
				if (data.zoom < 4) {
					setZoom(data.zoom + 1);
					handled = true;
				}
				break;
				
			case 'ArrowLeft':
			case 'ArrowDown':
				// ズームアウト
				if (data.zoom > 0) {
					setZoom(data.zoom - 1);
					handled = true;
				}
				break;
				
			case 'Home':
				// 最小ズーム
				setZoom(0);
				handled = true;
				break;
				
			case 'End':
				// 最大ズーム
				setZoom(4);
				handled = true;
				break;
				
			case '+':
			case '=':
				// ズームイン
				if (data.zoom < 4) {
					setZoom(data.zoom + 1);
					handled = true;
				}
				break;
				
			case '-':
			case '_':
				// ズームアウト
				if (data.zoom > 0) {
					setZoom(data.zoom - 1);
					handled = true;
				}
				break;
		}
		
		if (handled) {
			e.preventDefault();
		}
	});

	update_cursor();
}
