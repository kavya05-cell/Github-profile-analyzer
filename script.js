async function searchUser(){
const username = document.getElementById("username").value;
const profile = document.getElementById("profile");
const repoContainer = document.getElementById("repos");
profile.innerHTML = "Loading profile...";
repoContainer.innerHTML = "";
try{
const userResponse = await fetch(`https://api.github.com/users/${username}`);
if(!userResponse.ok){
throw new Error("User not found");
}
const userData = await userResponse.json();
const repoResponse = await fetch(`https://api.github.com/users/${username}/repos`);
const repoData = await repoResponse.json();
displayProfile(userData);
displayRepos(repoData);
analyzeLanguages(repoData);
languageChart(repoData);

}catch(error){
profile.innerHTML = "User not found";
}
}


function displayProfile(user){
const card = document.getElementById("profile-card");
card.innerHTML = `
<img src="${user.avatar_url}" width="100" style="border-radius:50%">
<h2>${user.name}</h2>
<p>${user.bio ?? "No bio available"}</p>
`;
document.getElementById("followers").innerText = user.followers;
document.getElementById("following").innerText = user.following;
document.getElementById("repos-count").innerText = user.public_repos;
}



function displayRepos(repos){
const repoContainer = document.getElementById("repos");
repoContainer.innerHTML="";
repos
.sort((a,b)=>b.stargazers_count-a.stargazers_count)
.slice(0,6)
.forEach(repo=>{
repoContainer.innerHTML += `
<div class="repo-card">
<h3>${repo.name}</h3>
<p>⭐ ${repo.stargazers_count}</p>
<p>${repo.language ?? "Unknown"}</p>
<a href="${repo.html_url}" target="_blank">View Repository</a>
</div>
`;
});
}


function analyzeLanguages(repos){
const languageCount = {};
repos.forEach(repo => {
if(repo.language){
if(languageCount[repo.language]){
languageCount[repo.language]++;
}
}else{
languageCount[repo.language] = 1;
}
});


let resultHTML = "<h3>Language Usage</h3>";
for(let lang in languageCount){
resultHTML += `<p>${lang}: ${languageCount[lang]} repos</p>`;
}
document.getElementById("profile").innerHTML += resultHTML;
}




function languageChart(repos){
const languages = {};
repos.forEach(repo => {
if(repo.language){
if(languages[repo.language]){
languages[repo.language]++;
}else{
languages[repo.language] = 1;
}
}
});
const labels = Object.keys(languages);
const data = Object.values(languages);
const ctx = document.getElementById("languageChart");
new Chart(ctx,{
type:'doughnut',
data:{
labels:labels,
datasets:[{
data:data
}]
}
});
}