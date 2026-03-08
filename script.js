async function searchUser(){
const username=document.getElementById("username").value;

if(username===""){alert("Enter username");return;}
const userRes=await fetch(`https://api.github.com/users/${username}`);
const userData=await userRes.json();
const repoRes=await fetch(`https://api.github.com/users/${username}/repos`);
const repoData=await repoRes.json();
displayProfile(userData);
displayRepos(repoData);
languageChart(repoData);
GitHubCalendar(".calendar",username,{responsive:true});
document.getElementById("results").style.display="block";
}

function displayProfile(user){
const profile=document.getElementById("profile");
const name=user.name?user.name:user.login;
const bio=user.bio?user.bio:"No bio available";
profile.innerHTML=`
<img src="${user.avatar_url}" width="100" style="border-radius:50%;margin-bottom:10px;">
<h2>${name}</h2>
<p>${bio}</p>
`;
document.getElementById("followers").innerText=user.followers||0;
document.getElementById("following").innerText=user.following||0;
document.getElementById("repos-count").innerText=user.public_repos||0;
}

function displayRepos(repos){
const repoContainer=document.getElementById("repos");
repoContainer.innerHTML="";
repos.sort((a,b)=>b.stargazers_count-a.stargazers_count).slice(0,6).forEach(repo=>{
repoContainer.innerHTML+=`<div class="repo-card"><h3>${repo.name}</h3>
<p>⭐${repo.stargazers_count}</p><p>${repo.language??"Unknown"}</p>
<a href="${repo.html_url}" target="_blank">View Repo</a></div>`;
});
}

let chartInstance=null;


function languageChart(repos){
const languages={};
repos.forEach(repo=>{
if(repo.language){
languages[repo.language] ? languages[repo.language]++ : languages[repo.language]=1;
}
});
const labels=Object.keys(languages);
const data=Object.values(languages);
const ctx=document.getElementById("languageChart");
if(!ctx) return;
/* destroy previous chart before creating a new one */
if(chartInstance){
chartInstance.destroy();
}
chartInstance=new Chart(ctx,{
type:'doughnut',
data:{
labels:labels,
datasets:[{data:data}]
},
options:{
responsive:true,
maintainAspectRatio:false
}
});
}
