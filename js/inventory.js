// 增加产品组
function addProductGroup() {
    const groupHTML = `
    <div class="product-group">
        <label>产品名:</label>
        <input list="product-names" class="product-name" placeholder="输入或选择产品" required>
        <datalist id="product-names">
                    <option value="调色桶">
                    <option value="滚筒">
                    <option value="砂架">
                    <option value="羊毛刷">
                    <option value="猪毛刷">
                    <option value="美纹纸">
                    <option value="弱粘纸胶带">
                    <option value="55公分保护膜">
                    <option value="2.4米保护膜">
                    <option value="1.1米保护膜">
                    <option value="1.5米保护膜">
                    <option value="底漆">
                    <option value="面漆">
                    <option value="底料">
                    <option value="面料">
                    <option value="白胶">
                    <option value="阴角">
                    <option value="阳角">
                    <option value="嵌缝膏">
                    <option value="大网">
                    <option value="小网">
                    <option value="净味防霉防潮面漆">
                    <option value="硅藻防霉净味">
        </datalist>

        <label>规格:</label>
        <input type="text" class="product-spec" placeholder="规格" required>

        <label>数量:</label>
        <input type="number" class="product-quantity" placeholder="数量" required>

        <label>调色费:</label>
        <input type="text" class="product-colorfee" placeholder="调色费" min="0" step="any"> 

        <label>单价:</label>
        <input type="number" class="product-price" placeholder="单价" min="0" step="0.01" required>

        <label>组总价:</label>
        <input type="number" class="product-group-price" placeholder="组总价" readonly>

        <button type="button" class="remove-button" onclick="removeProductGroup(this)">删除</button>
    </div>`;
    document.getElementById('product-groups').insertAdjacentHTML('beforeend', groupHTML);
}

// 删除产品组
function removeProductGroup(button) {
    button.parentElement.remove();
    calculateTotalPrice();
}

document.addEventListener('input', function(event) {
    // 监听数量、调色费、单价的变化
    if (event.target.classList.contains('product-quantity') ||
        event.target.classList.contains('product-colorfee') ||
        event.target.classList.contains('product-price')) {

        // 找到包含输入元素的组    
        const group = event.target.closest('.product-group');
        const quantity = parseFloat(group.querySelector('.product-quantity').value) || 0;
        const price = parseFloat(group.querySelector('.product-price').value) || 0;
        const colorfee = parseFloat(group.querySelector('.product-colorfee').value) || 0;

        // 获取组单价元素
        const groupPrice = group.querySelector('.product-group-price');
        
        // 计算并更新组单价
        groupPrice.value = (quantity * price + colorfee).toFixed(2);

        // 更新总金额
        calculateTotalPrice();
    }

    // 监听运费变化
    if (event.target.id === 'shipping-fee' || event.target.id === 'doorstep-fee') {
        calculateTotalPrice();
    }
});

// 计算总金额
function calculateTotalPrice() {
    let totalPrice = 0;

    // 计算所有组的总价
    document.querySelectorAll('.product-group-price').forEach(groupPrice => {
        totalPrice += parseFloat(groupPrice.value) || 0;
    });

    // 获取运费和搬运费
    const shippingFee = parseFloat(document.getElementById('shipping-fee').value) || 0; // 运费
    const doorstepFee = parseFloat(document.getElementById('doorstep-fee').value) || 0; // 搬运费

    // 计算总金额（包含运费和搬运费）
    totalPrice += shippingFee + doorstepFee;

    // 更新总金额的显示
    document.getElementById('total-price').value = totalPrice.toFixed(2);
}


// 处理表单提交并显示数据，不立即计算库存
document.getElementById('inventory-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 防止表单默认提交行为

    // 获取日期
    const date = document.getElementById('date').value;

    // 获取备注信息
    const notes = document.getElementById('notes').value;

    // 获取所有产品组的数据
    const productGroupsForDisplay = [];
    document.querySelectorAll('.product-group').forEach(group => {
        const productName = group.querySelector('.product-name').value;
        const productSpec = group.querySelector('.product-spec').value;
        const colorfee = group.querySelector('.product-colorfee').value || 0; 
        const quantity = group.querySelector('.product-quantity').value;
        const price = group.querySelector('.product-price').value;
        const groupPrice = group.querySelector('.product-group-price').value;

        if (productName && quantity) {
            // 为显示准备完整数据
            productGroupsForDisplay.push({
                productName,
                productSpec,
                quantity,
                colorfee,
                price,
                groupPrice
            });
        }
    });

    // 获取运费和收货信息
    const shippingFee = document.getElementById('shipping-fee').value || "0"; // 当运费为空时，显示为 0
    const doorstepFee = document.getElementById('doorstep-fee').value || "0"; // 当搬运费为空时，显示为 0
    const receiverName = document.getElementById('receiver-name').value;
    const receiverPhone = document.getElementById('receiver-phone').value;
    const receiverAddress = document.getElementById('receiver-address').value;

    // 获取总金额（确保获取的元素存在）
const totalPriceElement = document.getElementById('total-price');
const totalPrice = totalPriceElement ? totalPriceElement.value : "";

// 修复选择器问题：类名带空格的选择器需要用 `.` 替代空格
const interiorDecoratorElement = document.querySelector('.Interior-Decoration');
const interiorDecorator = interiorDecoratorElement ? interiorDecoratorElement.value : "";
console.log('Interior Decorator:', interiorDecorator);
// 显示数据
let dataHTML = `<h2>三棵树产品销售单</h2>`;
dataHTML += `<p><strong>日期:</strong> ${date}</p>`;
dataHTML += `<p><strong>装饰公司:</strong> ${interiorDecorator}</p>`;
dataHTML += `<p><strong>收货人电话:</strong> ${receiverPhone}</p>`;
dataHTML += `<p><strong>收货人名称:</strong> ${receiverName}</p>`;
dataHTML += `<p><strong>收货地址:</strong> ${receiverAddress}</p>`;
dataHTML += `<table>
                <thead>
                    <tr>
                        <th>产品名</th>
                        <th>规格</th>
                        <th>数量</th>
                        <th>单价</th>
                        <th>调色费</th>
                        <th>组总价</th>
                    </tr>
                </thead>
                <tbody>`;
productGroupsForDisplay.forEach(group => {
    dataHTML += `<tr>
                    <td>${group.productName}</td>
                    <td>${group.productSpec}</td>
                    <td>${group.quantity}</td>
                    <td>${group.price}</td>
                    <td>${group.colorfee}</td>
                    <td>${group.groupPrice}</td>
                </tr>`;
});
dataHTML += `</tbody></table>`;
dataHTML += `<p><strong>运费:</strong> ${shippingFee}</p>`;  
dataHTML += `<p><strong>搬运费:</strong> ${doorstepFee}</p>`;  
dataHTML += `<p><strong>总金额:</strong> ${totalPrice}</p>`;
dataHTML += `<p><strong>备注:</strong> ${notes}</p>`;

// 设置已提交数据的 HTML 内容
const submittedDataElement = document.getElementById('submitted-data');
if (submittedDataElement) {
    submittedDataElement.innerHTML = dataHTML;
} else {
    console.error('Element with ID "submitted-data" not found.');
}


    // 显示下载截图按钮和库存计算按钮
    document.getElementById('download-btn').style.display = 'block';
    document.getElementById('calculate-inventory-btn').style.display = 'block';

    // 保存数据到 localStorage
    const submittedData = {
        date,
        notes,
        productGroups: productGroupsForDisplay,
        shippingFee,
        receiverName,
        receiverPhone,
        receiverAddress,
        totalPrice
    };
    const existingData = JSON.parse(localStorage.getItem('submittedData')) || [];
    existingData.push(submittedData);
    localStorage.setItem('submittedData', JSON.stringify(existingData));
});


// 下载提交数据截图
document.getElementById('download-btn').addEventListener('click', function() {
    const submittedData = document.getElementById('submitted-data');
    if (!submittedData.innerHTML.trim()) {
        alert('没有提交的数据可供下载。');
        return;
    }
    function adjustForScreenshot() {
        const submittedData = document.getElementById('submitted-data');
        // 截图前调整大小和边距
        submittedData.style.width = '148mm';
        submittedData.style.height = '210mm';
        submittedData.style.overflow = 'hidden';
        submittedData.style.margin = '0 auto'; // 居中对齐
        submittedData.style.padding = '10mm'; // 统一的内边距
        submittedData.style.boxSizing = 'border-box'; // 让padding包含在总宽度和高度内
    }
    
    
    // 生成截图前调用
    adjustForScreenshot();
    

    // 使用 html2canvas 进行截图
    html2canvas(submittedData, {
    scale: 2, // 提高截图分辨率
    width: 148 * 3.7795275591, // A5 宽度 (毫米到像素)
    height: 210 * 3.7795275591 // A5 高度 (毫米到像素)
    }).then(function(canvas) {
        // 将截图转换为图片数据
        const imgData = canvas.toDataURL("image/png");

        // 显示截图图片
        const imgElement = document.getElementById('screenshot-img');
        imgElement.src = imgData;
        imgElement.style.display = 'block'; // 显示图片


        // 触发下载
        const link = document.createElement('a');
        link.href = imgData;
        link.download = '提交的数据_A5_截图.png';
        link.click();
    }).catch(function(error) {
        console.error('截图失败:', error);
        alert('截图失败，请重试。');
    });
});


// 添加上传截图按钮的事件监听
document.getElementById('upload-btn').addEventListener('click', function() {
    // 显示文件输入框
    document.getElementById('screenshot-file').click();
});

// 处理文件选择
document.getElementById('screenshot-file').addEventListener('change', function(event) {
    const file = event.target.files[0]; // 获取选择的文件
    if (!file) {
        alert('未选择文件。');
        return;
    }

    // 检查文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']; // 允许的图片格式
    if (!validTypes.includes(file.type)) {
        alert('请上传有效的图片文件（jpg, png, gif）。');
        return;
    }

    // 准备要上传的数据
    const formData = new FormData();
    formData.append('screenshot', file); // 添加截图文件
    formData.append('receiverCompany', document.querySelector('.Interior Decoration').value); // 装饰公司
    formData.append('date', document.getElementById('date').value); // 日期

    // 发送文件到后端
    fetch('/api/upload_screenshot', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        console.log('上传成功:', data);
        alert('截图已成功上传！');
    }).catch(error => {
        console.error('上传失败:', error);
        alert('上传失败，请重试。');
    });
});

// 处理库存计算逻辑
document.getElementById('calculate-inventory-btn').addEventListener('click', function() {
    // 获取所有产品组的数据用于后端更新库存
    const productGroupsForBackend = [];
    document.querySelectorAll('.product-group').forEach(group => {
        const productName = group.querySelector('.product-name').value;
        const quantity = group.querySelector('.product-quantity').value;
        const warehouse = "default_warehouse"; // 可以从用户输入或选择中动态获取

        if (productName && quantity) {
            productGroupsForBackend.push({
                productName,
                quantity,
                warehouse
            });
        }
    });

    if (productGroupsForBackend.length === 0) {
        alert('没有产品信息可以更新库存。');
        return;
    }

    // 将产品数据发送到后端进行库存更新
    fetch('/api/update_inventory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productGroups: productGroupsForBackend })
    }).then(response => response.json())
    .then(data => {
        console.log('库存更新成功:', data);
        alert('库存已成功更新！');
    }).catch(error => {
        console.error('库存更新失败:', error);
        alert('库存更新失败，请重试。');
    });
});