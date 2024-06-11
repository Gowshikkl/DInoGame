const leaderboardList = document.getElementById('leaderboard-list');


getLeaderBoardServices();


console.log("workingg")

function getLeaderBoardServices (){
    axios.get("https://api.type1and2.com/" + "api/user/scores",{
        "email":"test@gmail.com",
        "score":5
    }).then((response) => {
        if(response?.data?.status == 200){
            console.log('res',response?.data)
            response?.data?.data?.forEach((entry, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                  <span class="rank">${index + 1}</span>
                  <span class="score"><span class="score-number">${entry.highScore}</span></span>
                  <span class="player">${entry.email}</span>
                `;
                leaderboardList.appendChild(listItem);
              });
              
       
        }else{
          console.log('errr',response?.data)
          
        }
      }).catch((error)=>{
        console.log("error",error);
       
      })
}