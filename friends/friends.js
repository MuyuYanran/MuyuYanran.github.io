// source/js/friends-simple.js
function loadFriendsData() {
  const container = document.getElementById('friends-container');
  if (!container) return;
  
  // 直接使用当前目录下的friends.json
  const jsonPath = './friends.json';
  
  fetch(jsonPath)
    .then(response => {
      if (!response.ok) {
        throw new Error('无法加载友链数据，请检查friends.json文件是否存在');
      }
      return response.json();
    })
    .then(friends => {
      container.innerHTML = '';
      
      if (!Array.isArray(friends)) {
        throw new Error('友链数据格式错误，应为数组');
      }
      
      const grid = document.createElement('div');
      grid.className = 'friends-grid';
      container.appendChild(grid);
      
      friends.forEach(friend => {
        if (!friend.name || !friend.url) return;
        
        const card = document.createElement('div');
        card.className = 'friend-card';
        
        const imgSrc = friend.img || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veihqOWGheWwhjwvdGV4dD48L3N2Zz4=';
        
        card.innerHTML = `
          <div class="card-img">
            <img src="${imgSrc}" alt="${friend.name}">
          </div>
          <div class="card-content">
            <h3 class="card-title">${friend.name}</h3>
            <p class="card-desc">${friend.desc || '这个博主很懒，没有留下任何描述'}</p>
            <a href="${friend.url}" target="_blank" rel="noopener" class="card-link">访问网站</a>
          </div>
        `;
        
        grid.appendChild(card);
      });
    })
    .catch(error => {
      console.error('加载友链数据失败:', error);
      container.innerHTML = `<div class="friends-error">${error.message}</div>`;
    });
}

document.addEventListener('DOMContentLoaded', loadFriendsData);