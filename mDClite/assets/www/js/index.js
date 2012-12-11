/*
 * 이 파일은 MIT라이센스로 배포되는 php.js의 내용 중 일부를 담고 있습니다.
 */

var _ID, _PAGE;
var _VERSION = "121205";
var _URL = 'http://gall.dcinside.com/';
var _GID;

function $(id) {
	return document.getElementById(id);
}

function $class(cid) {
	return document.getElementsByClassName(cid);
}

function $name(name) {
	return document.getElementsByName(name);
}

function $tag(tn) {
	return document.getElementsByTagName(tn);
}

Object.prototype.$= function(id) {
	return this.getElementById(id);
}

Object.prototype.$class= function(cid) {
	return this.getElementsByClassName(cid);
}

Object.prototype.$name= function(name) {
	return this.getElementsByName(name);
}

Object.prototype.$tag= function(tn) {
	return this.getElementsByTagName(tn);
}

Object.prototype.empty= function() {
	this.innerHTML='';
}

Object.prototype.hide= function() {
	this.style.display='none';
}

Object.prototype.linkRef= function(callback) {
	ref=this.$tag('a');
	for(i=0;ref!=null && i<ref.length;i++) {
		ref[i].addEventListener("click", callback, false);
	}
}

Object.prototype.fadeOut = function(d, a) {
	this.style.opacity = parseInt((this.style.opacity-a)*100)/100;
	if(this.style.opacity<a)
		return;
	setTimeout("$('"+this.id+"').fadeOut("+d+", "+a+")", d);
}

Object.prototype.removeElement = function() {
	this.parentNode.removeChild(this);
}

function openExtURL(URL) {
	navigator.app.loadUrl(URL, { openExternal:true });
}

var xmlhttpRequest = function(details) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			var responseState = {
				responseXML:(xmlhttp.readyState===4 ? xmlhttp.responseXML : ""),
				responseText:(xmlhttp.readyState===4 ? xmlhttp.responseText : ""),
				readyState:xmlhttp.readyState,
				responseHeaders:(xmlhttp.readyState===4 ? xmlhttp.getAllResponseHeaders() : ""),
				status:(xmlhttp.readyState===4 ? xmlhttp.status : 0),
				statusText:(xmlhttp.readyState===4 ? xmlhttp.statusText : "")
			};
			if(details.onreadystatechange) {
				details.onreadystatechange(responseState);
			}
			if(xmlhttp.readyState===4) {
				if(details.onload && xmlhttp.status>=200 && xmlhttp.status<300) {
					details.onload(responseState);
				}
				if(details.onerror && (xmlhttp.status<200 || xmlhttp.status>=300)) {
					details.onerror(responseState);
				}
			}
		};
		try { //cannot do cross domain
			xmlhttp.open(details.method, details.url);
		} catch(e) {
			console.log('XSS Error');
			if( details.onerror ) { //simulate a real error
				details.onerror({responseXML:"",responseText:"",readyState:4,responseHeaders:"",status:403,statusText:"Forbidden"});
			}
			return;
		}
		if(details.headers) {
			for(var prop in details.headers) {
				if(details.headers.hasOwnProperty(prop)) {
					xmlhttp.setRequestHeader(prop, details.headers[prop]);
				}
			}
		}
		xmlhttp.send( (typeof(details.data)!=="undefined")?details.data:null );
	};

function simpleRequest(url,callback,method,headers,data) {
	var details = {method:method?method:"GET",url:url};
	if(callback) {
		details.onload = function(response){callback(response);};
	}
	if(headers) {
		details.headers = headers;
	}
	if(data) {
		details.data = data;
	}
	xmlhttpRequest(details);
	return details;
}

function cElement(tag,insert,property,func,topDoc) {
	if(topDoc==undefined) {
		topDoc = document;
	}
	var element = tag!=''?topDoc.createElement(tag):topDoc.createTextNode(property);
	if(insert) {
		var parent;
		var before = null;
		if(insert.constructor === Array) {
			var target = insert[1];
			if(typeof target === "number") {
				parent = insert[0];
				before = parent.childNodes[target];
			} else {
				before = insert[0];
				parent = before.parentNode;
				if(target === "next") {
					before = before.nextSibling;
				}
			}
		} else {
			parent = insert;
		}
		parent.insertBefore(element,before);
	}
	if(property) {
		if(typeof property === "object") {
			for(var i in property) {
				if(property.hasOwnProperty(i)) {
					element[i] = property[i];
				}
			}
		} else {
			element.textContent = property;
		}
	}
	if(func) {
		element.addEventListener("click",func,false);
	}
	return element;
}

function strip_tags (input, allowed) {
	allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}

function dispError(text) {
	document.body.innerHTML = "<b style='font-size:1.2em'>m.DCmys Js Reader - 실행 중 오류</b><br /><br />" + text + "<br /><br /><small>m.DCmys Js Reader Version " + _VERSION+"</small>";
}

function trim(str){
   str = str.replace(/^[-\s]*/,'').replace(/[-\s]*$/, ''); 
   return str;
}

function time() {
	var dVal = new Date();
	return parseInt(dVal.getTime()/1000);
}

function parse_url (str, component) {
  var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
            'relative', 'path', 'directory', 'file', 'query', 'fragment'],
    ini = (this.php_js && this.php_js.ini) || {},
    mode = (ini['phpjs.parse_url.mode'] &&
      ini['phpjs.parse_url.mode'].local_value) || 'php',
    parser = {
      php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
    };

  var m = parser[mode].exec(str),
    uri = {},
    i = 14;
  while (i--) {
    if (m[i]) {
      uri[key[i]] = m[i];
    }
  }

  if (component) {
    return uri[component.replace('PHP_URL_', '').toLowerCase()];
  }
  if (mode !== 'php') {
    var name = (ini['phpjs.parse_url.queryKey'] &&
        ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
    parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
    uri[name] = {};
    uri[key[12]].replace(parser, function ($0, $1, $2) {
      if ($1) {uri[name][$1] = $2;}
    });
  }
  delete uri.source;
  return uri;
}

function parseQuery(str) {
	str = str.toString();
	str = str.substr(str.indexOf("?")+1);
	str = str.split("&");
	var query = {};
	var split;
	for(var i=0,l=str.length ; i<l ; i+=1) {
		split = str[i].split("=");
		query[split[0]] = split[1];
	}
	return query;
}

function matchArray(needle, haystack) {
	for(i=0;i<haystack.length;i++) {
		if(needle === haystack[i])
			return true;
	}
	return false;
}

function GID_detect(text) {
	if(text) {
		t = text.match(/_GID = \"([^\"]*?)\";/);
		if(t)
			_GID=t[1];
	}
	else
		_GID='';
	if(!_GID || _GID[1]=='') {
		pn = $('_GID').parentNode;
		$('_GID').removeElement();
		cElement('a', pn, {textContent:'로그인',id:'_GID', href:'http://dcid.dcinside.com/join/login.php?s_url='+encodeURIComponent('http://gall.dcinside.com/callback.php')}, function(e) {
			e.preventDefault();
			this.removeEventListener('click', arguments.callee);
			bgDiv = cElement('div', [document.body, 0], '', function() {
				frmLogin.removeElement();
				bgDiv.removeElement();
				btnCancel.removeElement();
				GID_detect();
			});
			bgDiv.style.opacity="0.5";
			bgDiv.style.backgroundColor="black";
			bgDiv.style.position="absolute";
			bgDiv.style.top='0px';
			bgDiv.style.left='0px';
			bgDiv.style.right='0px';
			bgDiv.style.bottom='0px';
			bgDiv.style.zIndex='4';
			btnCancel= cElement('div', [document.body, 0], '돌아가기', function() {
				frmLogin.removeElement();
				bgDiv.removeElement();
				btnCancel.removeElement();
				GID_detect();
			});
			console.log('Offset Width is '+document.body.offsetWidth+'px.');
			btnCancel.style.textAlign= 'center';
			btnCancel.style.margin= '0';
			btnCancel.style.padding= '0';
			btnCancel.style.position= 'absolute';
			btnCancel.style.top = $class('ft')[0].offsetTop+'px';
			btnCancel.style.left = document.body.offsetWidth>320?(document.body.offsetWidth-320)/2 + 'px':'0px';
			btnCancel.style.width= document.body.offsetWidth>320?'320px':'100%';
			btnCancel.style.height = ($class('ft')[0].offsetHeight-2)+'px';
			btnCancel.style.lineHeight = ($class('ft')[0].offsetHeight-2)+'px';
			btnCancel.style.border = '0';
			btnCancel.style.borderTop = '1px solid';
			btnCancel.style.backgroundColor='#F8F8F8';
			btnCancel.style.zIndex='5';
//			진저브레드의 경우 바로 아랫줄에서 이상하게 팝업이 뜬다. 원인 불명.
			frmLogin = cElement('iframe', document.body, {src:this.href, scrolling:'no'});
			frmLogin.style.margin= '0';
			frmLogin.style.padding= '0';
			frmLogin.style.position = 'absolute';
			frmLogin.style.top = ($class('ft')[0].offsetTop-170) + 'px';
			frmLogin.style.left = document.body.offsetWidth>320?(document.body.offsetWidth-320)/2 + 'px':'0px';
			frmLogin.style.width= document.body.offsetWidth>320?'320px':'100%';
			frmLogin.style.height= '170px';
			frmLogin.style.backgroundColor= 'white';
			frmLogin.style.border = '0';
			frmLogin.style.borderTop= '1px solid';
			frmLogin.style.borderBottom= '1px solid';
			frmLogin.style.zIndex='5';
			frmLogin.addEventListener('load', function() {
				switch(parse_url(frmLogin.contentWindow.location.toString()).path) {
					case '/join/login.php':
						frmLogin.contentWindow.document.getElementById('dcinside').style.margin='0';
						//frmLogin.contentWindow.document.getElementById('dcinside').style.position='static';
						frmLogin.contentWindow.document.getElementById('dcinside').style.left='-37px';
						frmLogin.contentWindow.document.getElementById('dcinside').style.top='-80px';
						frmLogin.contentWindow.document.getElementsByClassName('fl')[0].className='';
						frmLogin.contentWindow.document.getElementsByClassName('fr')[0].className='';
						//frmLogin.contentWindow.scrollTo(0, 0);
						break;
					case '/join/member_check.php':
						break;
					case '/callback.php':
						frmLogin.removeElement();
						bgDiv.removeElement();
						btnCancel.removeElement();
						DCL_URLProcessing(_URL);
						break;
					default:
						alert(frmLogin.contentWindow.location.toString());
						DCL_URLProcessing(frmLogin.contentWindow.location.toString());
						frmLogin.removeElement();
				}
			});
		});
		return;
	}
	$('_GID').href = 'http://dcid.dcinside.com/join/logout.php';
	$('_GID').textContent = '로그아웃';
	$('_GID').addEventListener("click", function(e) {
		e.preventDefault();
		this.removeEventListener('click', arguments.callee);
		frmLogin = cElement('iframe', [document.body, 0], {src:this.href, scrolling:'no'});
		frmLogin.hide();
		frmLogin.addEventListener('load', function() { frmLogin.removeElement(); DCL_URLProcessing(_URL); });
	});
}

function setProgressBar(per) {
	if($('pgBarContainer')==null) {
		container = cElement('div', [document.body,0], {id:'pgBarContainer', className:'pgBar'});
		container.style.opacity = '1';

		bar = cElement('div', container, {id:'pgBar'});
		bar.style.backgroundColor = '#33B5E5';
		bar.style.float='left';
		bar.style.height='3px';
	}
	$('pgBar').style.width =per+'%';
	if(per == 100) {
		$('pgBarContainer').fadeOut(50, 0.1);
	}
	else
		$('pgBarContainer').style.opacity=1;
}

function DCL_gallInit_ArticleLoad(id, no) {
	$('StatusBar').empty();
	cElement('a', $('StatusBar'), {textContent:'로드 중...'});
	loadTrouble = setTimeout(function() { cElement('li', [$('gallList'), 1], {innerHTML:'로드가 지연되고 있습니다.<br />문제가 있다고 생각되면 여기를 누르십시오.'}, function() { DCL_gallInit_ArticleLoad(id,no); }); }, 5000);
	setProgressBar (3);
	simpleRequest("http://gall.dcinside.com/list.php?id="+id+"&no="+no,
	function(response) {
		setProgressBar (30);
		clearTimeout(loadTrouble);
		var text = response.responseText;
		if(text.substr(0,9) === "<!DOCTYPE") {
			GID_detect(text);
			user_no = text.match(/<input[^>]*?id=\"dc\_no\" value=\"([0-9]+?)\">/);
			if(user_no)
				user_no=user_no[1];
			text = text.substring(text.indexOf("<script>document.domain='dcinside.com';"),text.lastIndexOf("<!-- 페이징 -->"));
			text = text.replace(/<td bgcolor="#f6f6f8" style="padding:2px 0px 0px 10px;" align=left><\/td>/g, '');

			var imgHTML = text.substring(text.indexOf("<div id='bgRelaBig'"),text.indexOf("<div id='bgRela'"));
			if(!imgHTML) { // 삭제된 게시물
				$('StatusBar').empty();
				cElement('a', $('StatusBar'), {textContent:'읽기 실패 (게시글이 없습니다)'});
				setProgressBar (100);
				return;
			}
			$('Article').empty();
			$('ArticleMenu').empty();
			window.scrollTo(0,0);

			var fragment = document.createDocumentFragment();
			var contentDiv = cElement("div",fragment,{className:"DCL12404_layerContent"});
			
			var DivHtml = text.substring(text.indexOf("<div id='bgRela' style='position:;width:100%;'>")+48,text.lastIndexOf('<td valign="top" align="right" style="padding-top:5px;">')-53);
			DivHtml= DivHtml.replace(/(<|<\/)(iframe|script)[^>]+>/g, "");

			var textDiv = cElement("div",contentDiv,{className:"DCL12404_layerText",innerHTML:DivHtml});
			if(DivHtml.indexOf("<!-- google_ad_section_end -->") != -1)
				DivHtml= DivHtml.substring(0,DivHtml.indexOf("<!-- google_ad_section_end -->"));

			title = trim(text.match(/<span style=\"float:left;\">(.*?)<\/span>/)[1]);
			
			var ipReg = /(?:IP Address : (\d+\.\d+\.\*\*\*\.\*\*\*))?<br \/>(\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}) <br \/>/g;
			var ipExec,ip,time;
			while( (ipExec=ipReg.exec(text)) ) {
				ip = ipExec[1];
				time = ipExec[2];
			}

			imgs = imgHTML.match(/src='(http:\/\/\w+\.dcinside\.com\/viewimage\.php[^']+)|src="(http:\/\/uccfs\.paran\.com[^"]+)/g);
			articleName = strip_tags(text.match(/<td bgcolor="#f6f6f8" style="padding:2px 0px 0px 10px;" align=left>((.|[\r\n])+?)<\/td>/)[1], '<img>');
			gallercon  = articleName.match(/<img src=[\'\"]([^\'\"]+?)[\'\"][^>]+?>/);
			articleRead = articleName.match(/조회수([0-9]+)/)[1];
			articleName = strip_tags(articleName.split('조회수')[0]);
			commentCnt  = text.match(/<strong class=\"txtOrange\">([0-9]+?)<\/strong>/)[1];
			comments    = strip_tags(text.match(/<!--댓글 리스트-->((.|[\r\n])+?)<\/table>/gm)[0], '<tr><td><img>');
			if(DivHtml.indexOf("<!--- google analytics -->") != -1)
				DivHtml= DivHtml.substring(0,DivHtml.indexOf("<!--- google analytics -->"));

			if(commentCnt!=='0'){
				comments=comments.split(/<tr[^>]*?>/);
				for(i=1;i<comments.length;i++) {
					comments[i]=comments[i].split(/<td[^>]*?>/);

					src=comments[i][1].match(/<img src=[\'\"]([^\'\"]+?)[\'\"][^>]+?>/);

					comments[i][0]=trim(strip_tags(comments[i][1]));
					if(comments[i][2].lastIndexOf('|')!=-1) {
						comments[i][1]=trim(strip_tags(comments[i][2].substr(comments[i][2].lastIndexOf('|')+1)));
						comments[i][2]=comments[i][2].substr(0, comments[i][2].lastIndexOf('|'));
					}
					else
						comments[i][1]='';
					comments[i][2]=trim(strip_tags(comments[i][2]));
					comments[i][3]=trim(strip_tags(comments[i][4]));
					if(src!=null)
						comments[i][4]=src[1];
					else
						comments[i][4]='';
					comments[i][5] = trim(strip_tags(comments[i][5], '<img>'));
					comments[i][6] = false;
					type1=comments[i][5].match(/show_delbox\(([0-9]+?),/);
					type2=comments[i][5].match(/new_delComment3\(.*?,.*?,([0-9]+?)\)/);
					if(comments[i][5] && type1) {
						comments[i][5]=type1[1];
						comments[i][6]=true;
					}
					else if(comments[i][5] && type2) {
						comments[i][5]=type2[1];
					}
					comments[i-1]=comments[i];
				}
				delete comments[i-1];
				comments.length--;
			}
			setProgressBar (70);

			frmTop = cElement('div', $('Article'), {className:'hx'});
			cElement('h4', frmTop, {innerHTML:title});
			writer = cElement('em', frmTop, {innerHTML:articleName});
			if(gallercon)
				cElement('img', writer, {src:gallercon[1]});
			cElement('span', frmTop, {textContent:time});

			frmTop = cElement('div', $('Article'), {className:'co',innerHTML:DivHtml});
			if(ip)
				cElement('div', frmTop, {className:'Host',textContent:'IP: '+ip});
			ibox = cElement('div', [frmTop, 0], {className:'ImageBox'});
			if(imgs) {
				for(i=0;i<imgs.length;i++) {
					cElement('img', ibox, {src:imgs[i].substring(imgs[i].indexOf('\'')+1)}).style.display="block";
				}
			}

			frmTop = cElement('div', $('Article'), {className:'StatusBar',id:'clb'});
			cElement('a', cElement('span', frmTop, {id:'CommentBar'}), {href:'http://gall.dcinside.com/list.php?id='+id+'&no='+no,textContent:'댓글 '+commentCnt+'개'}, DCL_URLProcessing);

			frmTop = cElement('ul', $('Article'), {className:'rp tgo open',id:'cl'});
			if(commentCnt!=='0'){
				for(i=0;i<comments.length;i++) {
					tForm = cElement('li', frmTop);
					cElement('p', cElement('div', tForm), {textContent:comments[i][2]});
					writer=cElement('em', tForm, {textContent:comments[i][0]});
					if(comments[i][4])
						cElement('img', writer, {src:comments[i][4]});
					cElement('span', tForm, {textContent:comments[i][3]});
					if(comments[i][1]!='')
						cElement('span', tForm, {textContent:comments[i][1]});
					if(comments[i][5]!='') {
						link = cElement('a', tForm, {href:'http://gall.dcinside.com/delcomment_ok.php?id=' + _ID + '&no=' + no + '&c_no=' + comments[i][5]}, function(e) { 
							e.preventDefault();
							password=null;
							if(this.getAttribute('delbox')) {
								password = prompt('패스워드를 입력하세요.');
								if(!password)
									return;
							}
							if(!confirm("댓글을 삭제하겠습니까?"))
								return;
							$('CommentBar').empty();
							cElement('a', $('CommentBar'), {textContent:'댓글 삭제 중...'});
							simpleRequest(this.href + (password?"&password="+password:""), function(response) {
								$('CommentBar').empty();
								var res = /<DELCOMMENTOK RESULT = "(\w+)"  ALERT="(.*)"  \/>/.exec(response.responseText);
								if(!res) {
									cElement('a', $('CommentBar'), {href:'http://gall.dcinside.com/list.php?id='+id+'&no='+no,textContent:'댓글 '+commentCnt+'개'}, DCL_URLProcessing);
									alert("댓글 삭제 중 오류가 발생했습니다.\n\n#code\n"+response.responseText);
									return;
								}
								if(res[1] === "1")
									DCL_URLProcessing();
								else
									alert(res[2]);
								cElement('a', $('CommentBar'), {href:'http://gall.dcinside.com/list.php?id='+id+'&no='+no,textContent:'댓글 '+commentCnt+'개'}, DCL_URLProcessing);
							});
						});
						cElement('img', link, {src:'http://wstatic.dcinside.com/gallery/skin/skin_new//btn_close_new.gif'});
						link.setAttribute('delbox', comments[i][6]?1:'');
					}
				}
			}
			frmCommentWrite = cElement('form', $('Article'), {className:'sn tgo open'});
			frmCommentWrite.addEventListener('submit', sendComment);
			var sendComment = function(e) {
				if(e)
					e.preventDefault();
				$('CommentBar').empty();
				cElement('a', $('CommentBar'), {textContent:'댓글 작성 중...'});
				
				writeFrame = cElement('iframe', $('Article'), {src:'http://m.dcinside.com/callback.php'});
				writeFrame.hide();
				writeFrame.addEventListener('load', function() {
					switch(parse_url(this.contentWindow.location.toString()).path) {
						case '/callback.php':							
							writeForm = cElement('form', this.contentWindow.document.body, {id:'writeForm',action:'http://m.dcinside.com/_option_write.php',method:'POST'});
							
							targ = frmCommentWrite.$tag('input');
							for(i=0;i<targ.length;i++)
								if(targ[i].name)
									cElement('input', writeForm, {type:'text',name:targ[i].name,value:targ[i].value});		
							targ = frmCommentWrite.$tag('textarea');
							for(i=0;i<targ.length;i++)
								if(targ[i].name)
									cElement('input', writeForm, {type:'text',name:targ[i].name,value:targ[i].value});
							cElement('input', writeForm, {type:'text',name:'mode',value:'comment'});
							cElement('input', writeForm, {type:'text',name:'user_no',value:user_no});
							writeForm.submit();
							break;
						default:
							$('CommentBar').empty();
							var res = this.contentWindow.document.body.innerHTML;
							this.removeElement();
							cElement('a', $('CommentBar'), {href:'http://gall.dcinside.com/list.php?id='+id+'&no='+no,textContent:'댓글 '+commentCnt+'개'}, DCL_URLProcessing);
							if(!res) {
								alert("댓글 등록 중 알 수 없는 오류가 발생했습니다.");
								return;
							}
							if(res!=='1') {
								alert("댓글 등록 중 오류가 발생했습니다.\n\n"+res);
								return;
							}
							DCL_gallInit_ArticleLoad(id,no);
					}
				});
				/*
				targ = frmCommentWrite.$tag('input');
				for(i=0;i<targ.length;i++)
					if(targ[i].name)
						query += '&'+targ[i].name+'='+encodeURIComponent(targ[i].value);
				targ = frmCommentWrite.$tag('textarea');
				for(i=0;i<targ.length;i++)
					if(targ[i].name)
						query += '&'+targ[i].name+'='+encodeURIComponent(targ[i].value);
				query = query.substr(1);
				console.log(query);
				try {
					console.log(simpleRequest('http://gall.dcinside.com/comment_ok.php', function (response) {
						var res = /<COMMENTOK RESULT = "(\w+)" ALERT="(.*)" \/>/.exec(response.responseText);
						if(!res) {
							alert("댓글 등록 중 오류가 발생했습니다.\n\n#code\n"+response.responseHeaders);
							console.log(response.responseHeaders);
							return;
						}
						if(res[1]!=1) {
							alert("댓글 등록 중 오류가 발생했습니다.\n\n"+res[2]);
							return;
						}
						DCL_gallInit_ArticleLoad(id,no);
					}, 'POST', {"Accept":"text/html","Content-Type":"application/x-www-form-urlencoded","Origin":'http://gall.dcinside.com',"Referer":'http://gall.dcinside.com/list.php?id='+id+'&no='+no}, query));
				}
				catch(e) {
					alert("오류: "+e.description);
				}*/
			};
			cElement('input', frmCommentWrite, {type:'hidden', name:'id', value:id});
			cElement('input', frmCommentWrite, {type:'hidden', name:'no', value:no});
			frmTop = cElement('ul', frmCommentWrite);

			if(!_GID) {
				t = cElement('li', frmTop);
				cElement('', t, {textContent:'이름:'});
				cElement('input', t, {type:'text', name:'name'});
				cElement('br', t);
				cElement('', t, {textContent:'비밀번호:'});
				cElement('input', t, {type:'password', name:'password'});
			}
			t = cElement('li', frmTop);
			cElement('textarea', t, {name:'comment_memo', cols:'20', rows:'5', className:'itxx'}).addEventListener('keydown', function(e) { if(event.keyCode == 13) { e.preventDefault(); sendComment(); } });
			cElement('input', cElement('div', frmCommentWrite, {className:'ar'}), {type:'button', value:'댓글등록'}, sendComment);

			cElement('a', cElement('li', $('ArticleMenu'), {className:'fl'}), {href:'http://gall.dcinside.com/list.php?id='+id+'&page='+_PAGE, textContent:'목록', className:'bn'}, DCL_URLProcessing);
			cElement('a', cElement('li', $('ArticleMenu'), {className:'fr'}), {href:'http://gall.dcinside.com/article_write.php?id='+id, textContent:'글쓰기', className:'bn'});

			$('Article').style.display="block";
			$('ArticleMenu').style.display="block";
			$('StatusBar').empty();
			cElement('a', $('StatusBar'), {textContent:_PAGE+' 페이지', href:'http://gall.dcinside.com/list.php?id='+id+'&page='+_PAGE}, DCL_URLProcessing);
			setProgressBar (100);
		}
	});
}

function DCL_gallInit_GallLoad(id, page, etc) {
	$('StatusBar').empty();
	cElement('a', $('StatusBar'), {textContent:'로드 중...'});
	setProgressBar (3);
	if(etc===undefined) {
		etc='';
	}
	
	if(page=='')
		page=1;
	page=parseInt(page);

	loadTrouble = setTimeout(function() { cElement('li', [$('gallList'), 1], {innerHTML:'로드가 지연되고 있습니다.<br />문제가 있다고 생각되면 여기를 누르십시오.'}, function() { DCL_gallInit_GallLoad(id,page,etc); }); }, 5000);

	simpleRequest('http://gall.dcinside.com/list.php?id='+id+'&page='+page+'&'+etc+'dummy='+time(), function (response) {
		setProgressBar (15);
		clearTimeout(loadTrouble);
		var text = response.responseText;
		var title= text.match(/<input type="hidden" id="share_name" value="(.+?)">/);
		if(title) {
			setProgressBar (20);
			GID_detect(text);
			_ID = id;
			_PAGE = page;
			$('Article').hide();
			$('ArticleMenu').hide();
			$('Article').empty();
			$('ArticleMenu').empty();
			if(etc=='')
				$('searchKeyword').value='';
			title=title[1];
			$('gallList').empty();
			window.scrollTo(0,0);
			cElement('span', cElement('li', gallList, {className:'StatusBar', id:'StatusBar'}));
			cElement('a', $('StatusBar'), {textContent:'작성 중...'});

			layerAD = cElement('div', cElement('li', $('gallList')), {className:'ad', id:'ad'});
			cElement('script', layerAD, {type:'text/javascript', textContent:'var daum_adam_vars={client:"414eZ0aT13b76c27a44",position:"MIDDLE",bannerDivId:"ad",test:false};'});
			cElement('script', layerAD, {type:'text/javascript',src:'http://m.adtc.daum.net/js/mobilead.js'});

			$('titleGallName').textContent = title;
			cElement('span', $('titleGallName'), {className:'gallLogo2', textContent:' 갤러리', id:'titleGallName2'});
			setProgressBar (30);

			var listitems = text.match(/<tr.*?onMouseOut=this\.style\.backgroundColor\=.*?onMouseOver=this\.style\.backgroundColor\='.+?'>((.|[\r\n])+?)<\/tr>/mg);
			
			if(text.match('검색된 결과가 없습니다. \'다음검색\' 버튼을 눌러주세요.')) {
				$('Pager').empty();
				cElement('strong', $('Pager'), {textContent:'0 / 0'});
				$('StatusBar').empty();
				cElement('a', $('StatusBar'), {href:'http://gall.dcinside.com/list.php?id='+id+'&page='+page,textContent:page+' 페이지'}, function(e) { e.preventDefault(); DCL_gallInit_GallLoad(id, page, etc); });
				cElement('a', cElement('li', $('gallList')), {textContent:'검색된 결과가 없습니다.'});
				return;
			}

			for(i=0;i<listitems.length;i++) {
				listitems[i]=listitems[i].replace(/&nbsp;/g, ' ');
				listitems[i]=listitems[i].replace(/<tr >(.|[\r\n])+?<\/tr>/g, '');
				item=listitems[i].split(/<td.*?>/);
				item[0]=item[3].match(/<a href=[\'\"]([^\'\"]+)[\'\"][^>]+>/)[1];
				item[1]=item[3].match(/<img src=[\'\"]([^\'\"]+)[\'\"] \/>/)[1];
				item[7]=item[4].match(/<img src=[\'\"]([^\'\"]+?)[\'\"][^>]+?>/);
				if(item[7]===null)
					item[7]='';
				else
					item[7]=item[7][1];
				item[8]=item[3].match(/<a href=[\'\"][^\'\"]+?view_comment=1[\'\"][^>]+?>\[([0-9]+)\]<\/a>/);
				if(item[8]===null)
					item[8]='0';
				else
					item[8]=item[8][1];
				item[2]=trim(strip_tags(item[2]));
				item[3]=trim(strip_tags(item[3].replace(/<a href=[\'\"][^\'\"]+?view_comment=1[\'\"][^>]+?>\[([0-9]+)\]<\/a>/, '')));
				item[4]=trim(strip_tags(item[4]))
				writetime=item[5].match(/<span title=\'([^\']+?)\'>/);
				if(writetime===null)
					item[5]=trim(strip_tags(item[5]));
				else
					item[5]=writetime[1];
				item[6]=trim(strip_tags(item[6]));

				if(item[0].substr(0, 1)=='/')
					item[0]='http://gall.dcinside.com'+item[0];
				gallListItem = cElement('a', cElement('li', $('gallList')), {textContent:item[3], href:item[0]}, DCL_URLProcessing);
				if(item[1])
					cElement('img', [gallListItem,0], {src:item[1]});
				if(item[8]!='0')
					cElement('span', gallListItem, {textContent:'['+item[8]+']', className:'comment'});
				auth=cElement('span', gallListItem, {className:'auth'});
				uinfo=cElement('em', auth, item[4]);
				if(item[7])
					cElement('img', uinfo, {src:item[7]});
				cElement('span', auth, item[5]);

				setProgressBar (i/listitems.length*60+30);
			}
			
			LastPage = text.match(/<a href=\"[^\"]+\"> ([0-9.]+?) <\/a>/g);
			LastPage = LastPage[LastPage.length-1].match(/page=([0-9]+)&/)[1];
			
			$('Pager').empty();
			if(page>1)
				cElement('a', $('Pager'), {href:'http://gall.dcinside.com/list.php?id='+id+'&page='+(page-1), textContent:'‹ 이전'}, function (e) { e.preventDefault(); DCL_gallInit_GallLoad(id, page-1, etc);});
			cElement('strong', $('Pager'), {textContent:page+' / '+LastPage}, function(e) { e.preventDefault(); 
				var userPage=prompt("이동할 페이지를 입력하세요.");
				if (userPage<1 || userPage>parseInt(LastPage) || /[^0123456789]/g.test(userPage))
				{
					if(userPage!=null)
						alert("대상 페이지가 적절하지 않습니다. 1~"+LastPage+" 범위 내에서 입력하세요.");
					return false;
				}
				DCL_gallInit_GallLoad(id, userPage, etc);
			});
			if(page<LastPage)
				cElement('a', $('Pager'), {href:'http://gall.dcinside.com/list.php?id='+id+'&page='+(page+1), textContent:'다음 ›'}, DCL_URLProcessing);

			$('StatusBar').empty();
			cElement('a', $('StatusBar'), {href:'http://gall.dcinside.com/list.php?id='+id+'&page='+page,textContent:page+' 페이지'}, DCL_URLProcessing);
			setProgressBar (100);
		} else {
			$('StatusBar').empty();
			cElement('a', $('StatusBar'), {href:'http://gall.dcinside.com/list.php?id='+id+'&page='+page,textContent:'읽기 실패'}, DCL_URLProcessing);
			$('titleGallName').textContent = "오류";
			setProgressBar (100);
			console.log(text);
		}
	}, "GET", {"Accept":"text/html","Content-Type":"application/x-www-form-urlencoded","Referer":'http://gall.dcinside.com/'});
}

function DCL_gallInit(URL) {
	setProgressBar (2);
	if(parseQuery(URL).no===undefined) {
		_ID = parseQuery(URL).id;
		_PAGE=parseQuery(URL).page;
		if(!_PAGE)
			_PAGE=1;

		$('StatusBar').empty();
		cElement('a', $('StatusBar'), {href:'http://gall.dcinside.com/',textContent:'갤러리 읽는 중...'});
		setProgressBar (1);
		if($('titleGallName2')===null) {
			document.body.empty();
			cElement('a', cElement('h2', document.body), {href:'http://gall.dcinside.com/list.php?id='+_ID, textContent:'로드 중...', id:'titleGallName'}, DCL_URLProcessing);
			setProgressBar (2);

			cElement('div', document.body, {className:'rd', id:'Article'}).style.display='none';
			cElement('ul', document.body, {className:'cm', id:'ArticleMenu'}).style.display='none';

			gallList = cElement('ul', document.body, {className:'lt', id:'gallList'});
			cElement('span', cElement('li', gallList, {className:'StatusBar', id:'StatusBar'}));
			cElement('a', $('StatusBar'), {textContent:'로드 중...'});
			cElement('div', document.body, {id:"Pager", className:"pn"});
			searchF=cElement('form', cElement('div', document.body, {className:"sh"}), {id:'frmSearch',method:'get'});
			searchF.addEventListener("submit",function(e) { e.preventDefault(); DCL_gallInit_GallLoad(_ID, 1, 'keyword='+encodeURIComponent($('searchKeyword').value)+'&k_type='+$('search_select').value); },false);
			cElement('input', searchF, {type:'hidden',name:'page',value:'1'});
			sel=cElement('select', searchF, {className:'search_select',id:'search_select'});
			cElement('option', sel, {value:'1000',textContent:'이름'});
			cElement('option', sel, {value:'0100',textContent:'제목'});
			cElement('option', sel, {value:'0010',textContent:'내용'});
			cElement('option', sel, {value:'0110',textContent:'제목+내용',selected:true});
			cElement('option', sel, {value:'1100',textContent:'이름+제목'});
			cElement('option', sel, {value:'1010',textContent:'이름+내용'});
			cElement('option', sel, {value:'1110',textContent:'이름+제목+내용'});
			cElement('input', searchF, {type:'text',name:'keyword',value:'',id:'searchKeyword'});
			cElement('input', searchF, {type:'submit',className:'bn',value:'검색'});
			stat=cElement('ul', document.body, {className:"ft"});
			cElement('a', cElement('li', stat, {className:'fl'}), {textContent:'홈',href:'http://gall.dcinside.com/'}, DCL_URLProcessing);
			cElement('a', cElement('li', stat, {className:'fl'}), {textContent:'(오프라인)',id:'_GID'});
			cElement('a', cElement('li', stat, {className:'fr'}), {textContent:'설정',href:'http://gall.dcinside.com/do.php?action=setting'}, DCL_URLProcessing);
			cElement('div', document.body, {className:"foot",innerHTML:'Some CSS or JS files are under <a href="http://www.gnu.org/licenses/lgpl-2.0.html" target="_blank">LGPL v2</a>.<br />Contents from <a href="http://www.dcinside.com" target="_blank">DCinside.com</a><br />by <a href="http://blog.kasugano.kr/" target="_blank">하루카나소라<img src="http://wstatic.dcinside.com/gallery/skin/gallog/g_fix.gif" /></a>'});
			setProgressBar (3);
		}
		DCL_gallInit_GallLoad(_ID, _PAGE);
	}
	else {
		$('StatusBar').empty();
		cElement('a', $('StatusBar'), {href:'http://gall.dcinside.com/',textContent:'게시글 읽는 중...'});
		setProgressBar (1);

		_ID = parseQuery(URL).id;
		DCL_gallInit_ArticleLoad(_ID, parseQuery(URL).no);
	}
}

function DCL_URLProcessing(e) {
	if(this)
		href = this.href;

	if(typeof e == 'string')
		href = e;

	if(e===undefined) {
		if(!href)
			href = _URL;
		e=href;
	}

	if(!href)
		return dispError('대상 URL이 정의되지 않았습니다.');

	parsedURI = parse_url(href);

	wlHost = new Array('gall.dcinside.com', 'dcid.dcinside.com');

	if(typeof e != 'string')
		e.preventDefault();

	if(matchArray(parsedURI.host, wlHost)) {
		switch(parsedURI.path) {
			case '/':
				_URL = href;
//				history.pushState(null, document.title, href);
				return DCL_list(href);
			case '/list.php':
				_URL = href;
//				history.pushState(null, document.title, href);
				return DCL_gallInit(href);
			case '/join/login.php':
				return;
			case '/join/logout.php':
				return;
			default:
				return dispError('미리 정의되지 않은 내부 URL입니다.');
		}
	}
	try
	{
		openExtURL(href);
	}
	catch (e) {
		window.open(href);
	}
}

function DCL_list_GallLoad(page, extraoption) {
	if(extraoption==undefined || extraoption==null) {
		extraoption='';
	}
	$('StatusBar').empty();
	cElement('a', $('StatusBar'), {textContent:'읽는 중...'});
	setProgressBar (3);

	if(page)
		page=parseInt(page);
	else
		page=1;

	loadTrouble = setTimeout(function() { cElement('li', [$('gallList'), 1], {innerHTML:'로드가 지연되고 있습니다.<br />문제가 있다고 생각되면 여기를 누르십시오.'}, function() { DCL_list_GallLoad(page); }); }, 5000);

	simpleRequest('http://dc.m.dcmys.kr/index.app.php?ipp=7&page='+page+'&'+extraoption+'dummy='+time(), function (response) { 
		setProgressBar (20);
		clearTimeout(loadTrouble);
		$('gallList').empty();
		window.scrollTo(0,0);
		$('searchKeyword').value='';
		cElement('span', cElement('li', $('gallList'), {className:'StatusBar', id:'StatusBar'}));
		cElement('a', $('StatusBar'), {textContent:'작성 중...'});

		layerAD = cElement('div', cElement('li', $('gallList')), {className:'ad', id:'ad'});
		cElement('script', layerAD, {type:'text/javascript', textContent:'var daum_adam_vars={client:"414eZ0aT13b76c27a44",position:"MIDDLE",bannerDivId:"ad",test:false};'});
		cElement('script', layerAD, {type:'text/javascript',src:'http://m.adtc.daum.net/js/mobilead.js'});

		setProgressBar (30);

		if(page==1 && extraoption!='' && parseQuery(extraoption).keyword!='' && parseQuery(extraoption).keyword.match(/[a-z0-9_]+/)) {
			gallListItem = cElement('a', cElement('li', $('gallList')), {href:'http://gall.dcinside.com/list.php?id=' + parseQuery(extraoption).keyword}, DCL_URLProcessing);
			cElement('span', gallListItem, {textContent:'"'+parseQuery(extraoption).keyword+'" 갤러리로 이동', className:'title'});
		}

		var List = eval('('+response.responseText+')');
		i=-1;
		while(List['List'][++i]) {
			List['List'][i]['Name']=decodeURIComponent(List['List'][i]['Name']);
			gallListItem = cElement('a', cElement('li', $('gallList')), {href:'http://gall.dcinside.com/list.php?id=' + List['List'][i]['ID']}, DCL_URLProcessing);
			cElement('span', gallListItem, {textContent:List['List'][i]['Name']+' ', className:'title'});
			cElement('em', cElement('span', gallListItem, {className:'auth'}), {textContent:List['List'][i]['ID']});
			setProgressBar( i/List['List'].length*60 + 30 );
		}

		$('Pager').empty();
		if(page>1)
			cElement('a', $('Pager'), {href:'http://gall.dcinside.com/?page='+(page-1), textContent:'‹ 이전'}, DCL_URLProcessing);
		cElement('strong', $('Pager'), {textContent:page+' / '+List['LastPage']});
		if(page<List['LastPage'])
			cElement('a', $('Pager'), {href:'http://gall.dcinside.com/?page='+(page+1), textContent:'다음 ›'}, DCL_URLProcessing);

		$('StatusBar').empty();
		cElement('a', $('StatusBar'), {href:'http://gall.dcinside.com/?page='+page,textContent:page+' 페이지'}, DCL_URLProcessing);
		setProgressBar(100);
		simpleRequest('http://gall.dcinside.com/list.php?id=21&dummy='+time(), function (response) {
			GID_detect(response.responseText);
		});
	}, "GET", {"Accept":"text/html","Content-Type":"application/x-www-form-urlencoded","Origin":'http://gall.dcinside.com/'});
}

function DCL_list(URL) {
	if(URL && parseQuery(URL).page)
		page=parseQuery(URL).page;
	else
		page=1;
	if(!$('title') || $('title').textContent!=='갤러리 목록') {
		_ID=null;
		_PAGE=null;
		document.body.empty();
		cElement('a', cElement('h2', document.body), {href:'http://gall.dcinside.com/', textContent:'갤러리 목록', id:'title'}, DCL_URLProcessing);
		gallList = cElement('ul', document.body, {className:'lt', id:'gallList'});
		cElement('span', cElement('li', gallList, {className:'StatusBar', id:'StatusBar'}));
		cElement('a', $('StatusBar'), {textContent:'로드 중...'});
		cElement('div', document.body, {id:"Pager", className:"pn"});
		searchF=cElement('form', cElement('div', document.body, {className:"sh"}), {id:'frmSearch',method:'get'});
		searchF.addEventListener("submit",function(e) { e.preventDefault(); DCL_list_GallLoad(1, 'keyword='+$('searchKeyword').value+'&'); },false);
		cElement('input', searchF, {type:'hidden',name:'page',value:'1'});
		cElement('input', searchF, {type:'text',name:'keyword',value:'',id:'searchKeyword'});
		cElement('input', searchF, {type:'submit',className:'bn',value:'검색'});
		stat=cElement('ul', document.body, {className:"ft"});
		cElement('a', cElement('li', stat, {className:'fl'}), {textContent:'(오프라인)',id:'_GID'});
		cElement('a', cElement('li', stat, {className:'fr'}), {textContent:'설정',href:'http://gall.dcinside.com/do.php?action=setting'}, DCL_URLProcessing);
		cElement('div', document.body, {className:"foot",innerHTML:'Some CSS or JS files are under <a href="http://www.gnu.org/licenses/lgpl-2.0.html" target="_blank">LGPL v2</a>.<br />Contents from <a href="http://www.dcinside.com" target="_blank">DCinside.com</a><br />by <a href="http://blog.kasugano.kr/" target="_blank">하루카나소라<img src="http://wstatic.dcinside.com/gallery/skin/gallog/g_fix.gif" /></a>'}).linkRef(DCL_URLProcessing);
		setProgressBar (10);
	}
	
	DCL_list_GallLoad(page);
}

function DCL_main() {
	document.addEventListener("backbutton", function(e) { alert('뒤로 버튼 감지'); }, false);
	document.addEventListener("menubutton", function(e) { alert('메뉴 버튼 감지'); }, false);
	document.addEventListener("searchbutton", function(e) { e.preventDefault(); alert('검색 버튼 감지'); }, false);
//	try {
//		history.pushState(null, document.title, 'http://gall.dcinside.com/');
//	}
//	catch(e) {
//		dispError('초기화 실패: History API가 지원되지 않는 것 같습니다.');
//		return;
//	}
	DCL_list();
}