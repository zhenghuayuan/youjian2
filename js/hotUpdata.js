// 启动下载
var downlaodStart = function(options){
	var packageUrl = options.url;
	var loadValue = "正在更新  <span id='loadValue'>0%</span>";
	YDUI.dialog.loading.open(loadValue);
	function downloadStateChanged(downloadObj){
		downloadObj.addEventListener("statechanged", function(download, status){
			if(download.state == 3){
				loadValue = Math.floor((downloadObj.downloadedSize/downloadObj.totalSize)*100)+"%"
				$("#loadValue").html(loadValue);
			}else if(download.state == 4 && status == 200){
				YDUI.dialog.loading.close();
			}
		})
	}
	new Promise(function(resolve, reject){
		var download = plus.downloader.createDownload(packageUrl, {filename:"_doc/update/", timeout: 40, retry: 1, retryInterval: 15,}, function(packageObj, status){
			if(status == 200){
				console.log("下载wgt成功："+packageObj.filename);
				resolve(packageObj.filename);
			}else{
				YDUI.dialog.loading.close();
				reject("下载失败");
			}
		});
		downloadStateChanged(download);
		download.start();
	})
	.then(function(packageSrc){
		plus.nativeUI.showWaiting("正在安装...");
		plus.runtime.install(packageSrc,{force: true}, function(){
	        plus.nativeUI.closeWaiting();
	        plus.nativeUI.alert("应用资源更新完成，需重新打开", function(){
	            plus.runtime.restart();
	        });
	   	}, function(e){
	   		plus.nativeUI.alert("安装wgt文件失败["+e.code+"]：" + e.message);
	    });
	})
	.catch(function(e){
		plus.nativeUI.alert(e);
	})
}
