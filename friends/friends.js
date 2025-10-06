// source/js/friends.js
function loadFriendsData() {
  const container = document.getElementById('friends-container');
  if (!container) return;
  
  // 获取当前页面的路径
  const currentPath = window.location.pathname;
  const directoryPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
  
  // 尝试多种可能的JSON文件路径
  const possiblePaths = [
    './friends.json',
    '../friends.json',
    directoryPath + '/friends.json',
    '/friends.json',
    '/friends/friends.json'
  ];
  
  let loaded = false;
  
  // 尝试所有可能的路径
  function tryLoadFriends(pathIndex) {
    if (pathIndex >= possiblePaths.length) {
      if (!loaded) {
        container.innerHTML = '<div class="friends-error">无法加载友链数据，请检查friends.json文件是否存在</div>';
      }
      return;
    }
    
    const jsonPath = possiblePaths[pathIndex];
    
    fetch(jsonPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
        return response.json();
      })
      .then(friends => {
        // 如果已经加载成功，不再重复处理
        if (loaded) return;
        loaded = true;
        
        // 清空加载提示
        container.innerHTML = '';
        
        // 检查数据格式是否正确
        if (!Array.isArray(friends)) {
          throw new Error('友链数据格式错误，应为数组');
        }
        
        // 创建网格容器
        const grid = document.createElement('div');
        grid.className = 'friends-grid';
        container.appendChild(grid);
        
        // 为每个友链创建卡片
        friends.forEach(friend => {
          // 验证必需字段
          if (!friend.name || !friend.url) {
            console.warn('友链数据缺少必需字段:', friend);
            return;
          }
          
          const card = document.createElement('div');
          card.className = 'friend-card';
          
          // 设置默认图片（如果未提供）
          const imgSrc = friend.img || '/images/default-avatar.png';
          const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veihqOWGheWwhjwvdGV4dD48L3N2Zz4=';
          
          card.innerHTML = `
            <div class="card-img">
              <img src="${imgSrc}" alt="${friend.name}" onerror="this.src='${defaultImage}'">
            </div>
            <div class="card-content">
              <h3 class="card-title">${friend.name}</h3>
              <p class="card-desc">${friend.desc || '这个博主很懒，没有留下任何描述'}</p>
              <a href="${friend.url}" target="_blank" rel="noopener" class="card-link">访问网站</a>
            </div>
          `;
          
          grid.appendChild(card);
        });
        
        // 如果没有友链数据
        if (friends.length === 0) {
          container.innerHTML = '<div class="friends-error">暂无友链数据</div>';
        }
      })
      .catch(error => {
        console.warn(`无法从 ${jsonPath} 加载友链数据:`, error);
        // 尝试下一个路径
        tryLoadFriends(pathIndex + 1);
      });
  }
  
  // 开始尝试加载
  tryLoadFriends(0);
}

// 当DOM加载完成时执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFriendsData);
} else {
  loadFriendsData();
}