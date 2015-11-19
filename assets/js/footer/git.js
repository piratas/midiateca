var git={};
git.token='**token**';
git.apiDomain = 'https://api.github.com';
git.username="**username**";
git.userinfo="/users/" + git.username;
git.repos="/repos/" + git.username+ "/**repository**/";
git.pulls=git.repos+"pulls";
git.branch=git.repos+"branches/";

git.list=function(giturl){
	if (!giturl) giturl=app.apiDomain+app.pulls+'?callback='+git.listReceived+'&access_token='+app.token+'&state=all&per_page=50';
	$.ajax({
		url:giturl,
		dataType:'script'
	});
}


git.listReceived=function(e){
	console.log ("-> git.listReceived",e);
	$(e.data).each(function(i,pull){
		// console.log(pull)
		if (pull.head.label.indexOf(app.single.ticket)>-1){
			console.log('-> pull request #'+pull.number+' state:'+pull.state+' title:'+pull.title)
			var user=pull.user.html_url.split('/').pop();
			var assignee=(pull.assignee)?pull.assignee.html_url.split('/').pop():"no one";
			if (!app.titleChanged) {
				$('.subject h3').html("<span style='color:"+app.color[isMerged(pull.merged_at)]+"'>"+$('.subject h3').text()+"</span>")
				app.titleChanged=true;
			}
			$('#content .issue p.author').last().after('<p class="author gitpull"><a href='+pull.html_url+' style="color:'+app.color[isMerged(pull.merged_at)]+'">#'+pull.number+' ['+pull.state+(isMerged(pull.merged_at)?' - merged':' - not merged')+'] - '+pull.title+'</a> by <a href='+pull.user.html_url+'>'+user+'</a> assigned to '+(pull.assignee?'<a href='+pull.assignee.html_url+'>':'')+assignee+'</a></p>');
			// found=true;
		}
	})
	if (/*!found && */e.meta.Link[0][1].rel=='next'){
		getUrl(e.meta.Link[0][0])
	}else{
	 	console.log('-> git feed end')
	}
}
