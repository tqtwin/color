// Lấy danh sách công ty
async function fetchCompanies() {
    try {
        const response = await fetch('http://localhost:3000/companies');
        if (!response.ok) throw new Error('Network response was not ok');
        const companies = await response.json();
        const companyList = document.getElementById('company-list');
        companyList.innerHTML = '';
        companies.forEach(company => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="company.html?id=${company._id}">${company.name}</a>
                <button onclick="deleteCompany('${company._id}')">Xóa</button>
            `;
            companyList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        alert('Lỗi khi tải danh sách công ty');
    }
}

// Lấy chi tiết công ty
async function fetchCompanyDetails(id) {
    try {
        const response = await fetch(`http://localhost:3000/companies/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const company = await response.json();
        document.getElementById('company-id').textContent = company._id;
        document.getElementById('company-name').textContent = company.name;
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '';
        company.recipes.forEach(recipe => {
            const li = document.createElement('li');
            li.innerHTML = `<a onclick="showRecipeDetails('${recipe._id}')">${recipe.recipeID} - ${recipe.name}</a>`;
            recipeList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching company details:', error);
        alert('Lỗi khi tải chi tiết công ty');
    }
}

// Hiển thị chi tiết công thức
let currentRecipeId = null; // Store the current recipe ID for editing

async function showRecipeDetails(recipeId) {
    try {
        const response = await fetch(`http://localhost:3000/recipes/${recipeId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const recipe = await response.json();
        currentRecipeId = recipe._id; // Store for editing
        document.getElementById('recipe-id').textContent = recipe.recipeID;
        document.getElementById('recipe-name').textContent = recipe.name;
        document.getElementById('company-created-at').textContent = recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString('vi-VN') : '';
        const recipeImage = document.getElementById('recipe-image');
        recipeImage.src = recipe.image || 'placeholder.jpg';
        recipeImage.style.display = recipe.image ? 'block' : 'none';
        const colorCodesList = document.getElementById('recipe-color-codes');
        colorCodesList.innerHTML = recipe.colorCodes
            .map(color => `<li>${color.name} (${color.codeColor}, Số lượng: ${color.quantity})</li>`)
            .join('');
        document.getElementById('recipe-details').classList.add('show');
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        alert('Lỗi khi tải chi tiết công thức');
    }
}

// Tìm kiếm công thức theo mã công thức hoặc tên
async function searchRecipes(query) {
    try {
        const companyId = new URLSearchParams(window.location.search).get('id');
        const response = await fetch(`http://localhost:3000/companies/${companyId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const company = await response.json();
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '';

        const filteredRecipes = company.recipes.filter(recipe =>
            recipe.recipeID.toLowerCase().includes(query.toLowerCase()) ||
            recipe.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredRecipes.length === 0) {
            recipeList.innerHTML = '<li>Không tìm thấy công thức phù hợp.</li>';
            return;
        }

        filteredRecipes.forEach(recipe => {
            const li = document.createElement('li');
            li.innerHTML = `<a onclick="showRecipeDetails('${recipe._id}')">${recipe.recipeID} - ${recipe.name}</a>`;
            recipeList.appendChild(li);
        });
    } catch (error) {
        console.error('Error searching recipes:', error);
        alert('Lỗi khi tìm kiếm công thức');
    }
}

// Chỉnh sửa công thức
function editRecipe() {
    if (currentRecipeId) {
        window.location.href = `recipe-form.html?id=${currentRecipeId}`;
    } else {
        alert('Không tìm thấy công thức để chỉnh sửa.');
    }
}

// Xóa công ty
async function deleteCompany(id) {
    if (confirm('Bạn có chắc chắn muốn xóa công ty này không?')) {
        try {
            const response = await fetch(`http://localhost:3000/companies/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Đã xóa công ty');
                window.location.href = 'index.html';
            } else {
                alert('Không thể xóa công ty có công thức liên quan');
            }
        } catch (error) {
            console.error('Error deleting company:', error);
            alert('Lỗi khi xóa công ty');
        }
    }
}

// Lấy danh sách công thức
async function fetchRecipes() {
    try {
        const response = await fetch('http://localhost:3000/recipes');
        const recipes = await response.json();
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '';
        recipes.forEach(recipe => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${recipe.name} (Công ty: ${recipe.company.name})
                <a href="recipe-form.html?id=${recipe._id}">Chỉnh sửa</a>
                <button onclick="deleteRecipe('${recipe._id}')">Xóa</button>
            `;
            recipeList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

// Lấy chi tiết công thức (cho chỉnh sửa)
async function fetchRecipe(id) {
    try {
        const response = await fetch(`http://localhost:3000/recipes/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const recipe = await response.json();
        document.getElementById('recipeID').value = recipe.recipeID;
        document.getElementById('name').value = recipe.name;
        document.getElementById('createdDate').value = recipe.createdAt ? new Date(recipe.createdAt).toISOString().split('T')[0] : '';
        document.getElementById('image-base64').value = recipe.image || '';
        const imagePreview = document.getElementById('image-preview');
        imagePreview.src = recipe.image || '';
        imagePreview.style.display = recipe.image ? 'block' : 'none';
        document.getElementById('image-placeholder').style.display = recipe.image ? 'none' : 'block';
        document.getElementById('company').value = recipe.company._id;
        const colorCodesContainer = document.getElementById('color-codes');
        colorCodesContainer.innerHTML = '';
        recipe.colorCodes.forEach(color => {
            const div = document.createElement('div');
            div.className = 'color-code';
            div.innerHTML = `
                <input type="text" class="color-name" value="${color.name}" placeholder="Màu Sắc" required>
                <input type="text" class="color-code" value="${color.codeColor}" placeholder="Mã Màu" required>
                <input type="number" class="color-quantity" value="${color.quantity}" placeholder="Số lượng" required>
                <button type="button" onclick="removeColorCode(this)">Xóa</button>
            `;
            colorCodesContainer.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        alert('Lỗi khi tải công thức');
    }
}

// Xóa công thức
async function deleteRecipe(id) {
    if (confirm('Bạn có chắc chắn muốn xóa công thức này không?')) {
        try {
            await fetch(`http://localhost:3000/recipes/${id}`, { method: 'DELETE' });
            window.location.reload();
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Lỗi khi xóa công thức');
        }
    }
}

// Lấy danh sách công ty cho select
async function fetchCompaniesForSelect() {
    try {
        const response = await fetch('http://localhost:3000/companies');
        const companies = await response.json();
        const select = document.getElementById('company');
        select.innerHTML = '<option value="">Chọn 1 công ty</option>';
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company._id;
            option.textContent = company.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching companies for select:', error);
    }
}

// Thêm trường color code mới
function addColorCode() {
    const colorCodesContainer = document.getElementById('color-codes');
    const div = document.createElement('div');
    div.className = 'color-code';
    div.innerHTML = `
        <input type="text" class="color-name" placeholder="Màu Sắc" required>
        <input type="text" class="color-code" placeholder="Mã Màu" required>
        <input type="number" class="color-quantity" placeholder="Số lượng" required>
        <button type="button" onclick="removeColorCode(this)">Xóa</button>
    `;
    colorCodesContainer.appendChild(div);
}

// Xóa trường color code
function removeColorCode(button) {
    const colorCodesContainer = document.getElementById('color-codes');
    if (colorCodesContainer.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('Cần ít nhất một mã màu');
    }
}

// Lưu công thức
async function saveRecipe(event) {
    event.preventDefault();
    const recipeId = new URLSearchParams(window.location.search).get('id');
    const colorCodeDivs = document.getElementsByClassName('color-code');

    const colorCodes = Array.from(colorCodeDivs)
        .map(div => {
            const nameInput = div.querySelector('.color-name');
            const codeInput = div.querySelector('.color-code');
            const quantityInput = div.querySelector('.color-quantity');

            if (!nameInput || !codeInput || !quantityInput) {
                console.warn('Invalid color-code div:', div.innerHTML);
                return null;
            }

            if (!nameInput.value.trim() || !codeInput.value.trim() || !quantityInput.value.trim()) {
                console.warn('Empty input in color-code div:', div.innerHTML);
                return null;
            }

            return {
                name: nameInput.value,
                codeColor: codeInput.value,
                quantity: parseInt(quantityInput.value) || 0,
            };
        })
        .filter(item => item !== null);

    if (colorCodes.length === 0) {
        alert('Vui lòng thêm ít nhất một mã màu hợp lệ');
        return;
    }

    const recipeID = document.getElementById('recipeID')?.value;
    const name = document.getElementById('name')?.value;
    const createdDate = document.getElementById('createdDate')?.value;
    const imageBase64 = document.getElementById('image-base64')?.value;
    const company = document.getElementById('company')?.value;

    if (!recipeID || !name || !createdDate || !company) {
        alert('Vui lòng điền đầy đủ các trường bắt buộc');
        return;
    }

    const recipe = {
        recipeID,
        name,
        createdDate,
        image: imageBase64, // Match backend field name
        company,
        colorCodes,
    };

    try {
        const url = recipeId ? `http://localhost:3000/recipes/${recipeId}` : 'http://localhost:3000/recipes';
        const method = recipeId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipe),
        });
        if (response.ok) {
            alert(recipeId ? 'Công thức đã được cập nhật' : 'Công thức đã được tạo');
            window.location.href = 'recipes.html';
        } else {
            const errorData = await response.json();
            alert(`Lỗi khi lưu công thức: ${errorData.error || 'Lỗi không xác định'}`);
        }
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Lỗi khi lưu công thức');
    }
}

// Thêm công ty
async function saveCompany(event) {
    event.preventDefault();
    const company = {
        name: document.getElementById('company-name').value,
    };

    try {
        const response = await fetch('http://localhost:3000/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(company),
        });
        if (response.ok) {
            alert('Công ty đã được tạo');
            document.getElementById('company-form').reset();
            fetchCompanies();
        } else {
            const errorData = await response.json();
            alert(`Lỗi khi tạo công ty: ${errorData.error || 'Lỗi không xác định'}`);
        }
    } catch (error) {
        console.error('Error creating company:', error);
        alert('Lỗi khi tạo công ty');
    }
}