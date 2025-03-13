// Tabs
const logoutBtn = document.getElementById('logoutBtn');
const itemsContainer = document.getElementById('itemsContainer');

// Switch tabs
if (document.querySelectorAll('.tab-btn')) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    };
  });
}

// Item system
let items = JSON.parse(localStorage.getItem('lostFoundItems')) || [];
const itemForm = document.getElementById('itemForm');
const editIndexField = document.getElementById('editIndex');

function handleItemTypeChange() {
  const t = document.getElementById('item_type')?.value;
  const c = document.getElementById('otherItemTypeContainer');
  if (c) {
    c.style.display = t === 'Others' ? 'block' : 'none';
    document.getElementById('other_item_type').required = t === 'Others';
  }
}

function displayItems(list) {
  if (!itemsContainer) return;
  itemsContainer.innerHTML = '';
  list.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <h3>${item.item_name} (${item.status})</h3>
      <p><strong>Type:</strong> ${item.item_type}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Description:</strong> ${item.description}</p>
      <p><strong>Date/Time Posted:</strong> ${item.timestamp}</p>
      ${item.image ? `<img src="${item.image}" style="max-width:100%; height:auto;">` : ''}
      <p><strong>Reported by:</strong> ${item.reporter}</p>
      <p><strong>Contact:</strong> ${item.contact}</p>
      <p><strong>Email:</strong> ${item.email}</p>
      <div class="action-buttons">
        ${item.status === 'Lost' ? `<button onclick="markAsFound(${i})">Mark as Found</button>` : ''}
        <button onclick="editItem(${i})">Edit</button>
        <button onclick="confirmDelete(${i})">Delete</button>
      </div>
    `;
    itemsContainer.appendChild(div);
  });
}

function save() {
  localStorage.setItem('lostFoundItems', JSON.stringify(items));
  displayItems(items);
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('listStatusFilter').value = 'all';
  document.getElementById('listTypeFilter').value = 'all';
  displayItems(items);
}

function searchItems() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const statusFilter = document.getElementById('listStatusFilter').value;
  const typeFilter = document.getElementById('listTypeFilter').value;
  let filtered = items;

  if (keyword) {
    filtered = filtered.filter(item => item.item_name.toLowerCase().includes(keyword));
  }
  if (statusFilter !== 'all') {
    filtered = filtered.filter(item => item.status === statusFilter);
  }
  if (typeFilter !== 'all') {
    filtered = filtered.filter(item => item.item_type === typeFilter);
  }
  displayItems(filtered);
}

function editItem(i) {
  const item = items[i];
  document.getElementById('item_name').value = item.item_name;
  document.getElementById('item_type').value = item.item_type;
  handleItemTypeChange();
  if (item.item_type === 'Others') document.getElementById('other_item_type').value = item.item_type;
  document.getElementById('location').value = item.location;
  document.getElementById('description').value = item.description;
  document.getElementById('status').value = item.status;
  document.getElementById('reporter').value = item.reporter;
  document.getElementById('contact').value = item.contact;
  document.getElementById('email').value = item.email;
  editIndexField.value = i;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('[data-tab="postTab"]').classList.add('active');
  document.getElementById('postTab').classList.add('active');
}

function confirmDelete(i) {
  if (confirm("Are you sure you want to delete this item?")) {
    items.splice(i, 1);
    save();
  }
}

function markAsFound(index) {
  const name = prompt("Enter Claimer's Name:");
  const sid = prompt("Enter Student ID:");
  if (name && sid) {
    items[index].status = 'Found';
    items[index].claimed_by = { name: name, id: sid };
    save();
  }
}

if (itemForm) {
  itemForm.onsubmit = e => {
    e.preventDefault();
    const i = editIndexField.value;
    const ftype = document.getElementById('item_type').value;
    const imgFile = document.getElementById('image').files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const item = {
        item_name: document.getElementById('item_name').value,
        item_type: ftype === 'Others' ? document.getElementById('other_item_type').value : ftype,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value,
        image: reader.result,
        reporter: document.getElementById('reporter').value,
        contact: document.getElementById('contact').value,
        email: document.getElementById('email').value,
        timestamp: new Date().toLocaleString()
      };
      if (i === '') items.push(item); else items[i] = item;
      itemForm.reset(); handleItemTypeChange(); editIndexField.value = '';
      save();
    };
    if (imgFile) reader.readAsDataURL(imgFile); else reader.onload();
  };
}

// Event Listeners
if (document.getElementById('searchInput'))
  document.getElementById('searchInput').addEventListener('input', searchItems);
if (document.getElementById('listStatusFilter'))
  document.getElementById('listStatusFilter').addEventListener('change', searchItems);
if (document.getElementById('listTypeFilter'))
  document.getElementById('listTypeFilter').addEventListener('change', searchItems);

// Initial display
displayItems(items);