// source/js/friends.js
function loadFriendsData() {
  const container = document.getElementById('friends-container');
  if (!container) {
    console.log('找不到友链容器，等待重试...');
    // 如果容器不存在，稍后重试
    setTimeout(loadFriendsData, 100);
    return;
  }
  
  console.log('开始加载友链数据...');
  
  // 使用绝对路径
  const jsonPath = '/friends/friends.json';
  
  fetch(jsonPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(friends => {
      console.log('成功加载友链数据:', friends);
      renderFriends(friends, container);
    })
    .catch(error => {
      console.error('加载友链数据失败:', error);
      showError(container, error.message);
    });
}

function renderFriends(friends, container) {
  container.innerHTML = '';
  
  if (!Array.isArray(friends) || friends.length === 0) {
    container.innerHTML = '<div class="friends-error">暂无友链数据</div>';
    return;
  }
  
  const grid = document.createElement('div');
  grid.className = 'friends-grid';
  container.appendChild(grid);
  
  friends.forEach(friend => {
    if (!friend.name || !friend.url) {
      console.warn('跳过无效友链数据:', friend);
      return;
    }
    
    const card = createFriendCard(friend);
    grid.appendChild(card);
  });
}

function createFriendCard(friend) {
  const card = document.createElement('div');
  card.className = 'friend-card';
  
  // 处理图片路径
  let imgSrc = friend.img;
  if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
    imgSrc = '/' + imgSrc;
  }
  
  const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WKoOi9veihqOWGheWwhjwvdGV4dD48L3N2Zz4=';
  
  card.innerHTML = `
    <div class="card-img">
      <img src="${imgSrc || defaultImage}" alt="${friend.name}" 
           onerror="if(this.src!='${defaultImage}') this.src='${defaultImage}'">
    </div>
    <div class="card-content">
      <h3 class="card-title">${friend.name}</h3>
      <p class="card-desc">${friend.desc || '这个博主很懒，没有留下任何描述'}</p>
      <a href="${friend.url}" target="_blank" rel="noopener" class="card-link">访问网站</a>
    </div>
  `;
  
  return card;
}

function showError(container, message) {
  container.innerHTML = `
    <div class="friends-error">
      <p>${message}</p>
      <p>请检查 friends.json 文件是否存在且格式正确</p>
    </div>
  `;
}

// 使用多种方式确保脚本执行
function initFriends() {
  console.log('初始化友链功能...');
  
  // 如果DOM已经加载完成，直接执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFriendsData);
  } else {
    // DOM已经加载完成，直接执行
    loadFriendsData();
  }
}

// 立即开始初始化
initFriends();

// 添加一个后备方案：如果3秒后仍未加载，再次尝试
setTimeout(() => {
  const container = document.getElementById('friends-container');
  if (container && container.querySelector('.friends-loading')) {
    console.log('备用方案：重新加载友链数据');
    loadFriendsData();
  }
}, 3000);