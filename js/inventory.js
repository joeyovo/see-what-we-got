// 增加产品组
function addProductGroup() {
    const groupHTML = `
    <div class="product-group">
        <label>产品名:</label>
        <input list="product-names" class="product-name" placeholder="输入或选择产品" required>
        <datalist id="product-names">
            <option value="产品A">
            <option value="产品B">
            <option value="产品C">
        </datalist>

        <label>规格:</label>
        <input type="text" class="product-spec" placeholder="规格" required>

        <label>数量:</label>
        <input type="number" class="product-quantity" placeholder="数量" min="1" required>

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

// 实时计算组总价和总金额
document.addEventListener('input', function(event) {
    if (event.target.classList.contains('product-quantity') || event.target.classList.contains('product-price')) {
        const group = event.target.closest('.product-group');
        const quantity = parseFloat(group.querySelector('.product-quantity').value) || 0;
        const price = parseFloat(group.querySelector('.product-price').value) || 0;
        const groupPrice = group.querySelector('.product-group-price');
        groupPrice.value = (quantity * price).toFixed(2);
        calculateTotalPrice();
    }
    if (event.target.id === 'shipping-fee') {
        calculateTotalPrice();
    }
});

// 计算总金额
function calculateTotalPrice() {
    let totalPrice = 0;
    document.querySelectorAll('.product-group-price').forEach(groupPrice => {
        totalPrice += parseFloat(groupPrice.value) || 0;
    });

    const shippingFee = parseFloat(document.getElementById('shipping-fee').value) || 0;
    totalPrice += shippingFee;

    document.getElementById('total-price').value = totalPrice.toFixed(2);
}

// 处理表单提交
document.getElementById('inventory-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 防止表单默认提交行为

    // 获取日期
    const date = document.getElementById('date').value;

    // 获取备注信息
    const note = document.getElementById('note').value;

    // 获取所有产品组的数据
    const productGroups = [];
    document.querySelectorAll('.product-group').forEach(group => {
        const productName = group.querySelector('.product-name').value;
        const productSpec = group.querySelector('.product-spec').value;
        const quantity = group.querySelector('.product-quantity').value;
        const price = group.querySelector('.product-price').value;
        const groupPrice = group.querySelector('.product-group-price').value;

        // 确保所有字段都已填写
        if (productName && productSpec && quantity && price && groupPrice) {
            productGroups.push({
                productName,
                productSpec,
                quantity,
                price,
                groupPrice
            });
        }
    });

    // 获取运费和收货信息
    const shippingFee = document.getElementById('shipping-fee').value;
    const receiverName = document.getElementById('receiver-name').value;
    const receiverPhone = document.getElementById('receiver-phone').value;
    const receiverAddress = document.getElementById('receiver-address').value;

    // 获取总金额
    const totalPrice = document.getElementById('total-price').value;

    // 检查是否有至少一个产品组
    if (productGroups.length === 0) {
        alert('请至少添加一个产品组并填写所有字段。');
        return;
    }

    // 构建显示的数据HTML
    let dataHTML = `<h2>提交的库存数据</h2>`;
    dataHTML += `<p><strong>日期:</strong> ${date}</p>`;
    dataHTML += `<p><strong>备注:</strong> ${note}</p>`;
    dataHTML += `<table>
                    <thead>
                        <tr>
                            <th>产品名</th>
                            <th>规格</th>
                            <th>数量</th>
                            <th>单价</th>
                            <th>组总价</th>
                        </tr>
                    </thead>
                    <tbody>`;
    productGroups.forEach(group => {
        dataHTML += `<tr>
                        <td>${group.productName}</td>
                        <td>${group.productSpec}</td>
                        <td>${group.quantity}</td>
                        <td>${group.price}</td>
                        <td>${group.groupPrice}</td>
                    </tr>`;
    });
    dataHTML += `</tbody></table>`;
    dataHTML += `<p><strong>运费:</strong> ${shippingFee}</p>`;
    dataHTML += `<p><strong>收货人名称:</strong> ${receiverName}</p>`;
    dataHTML += `<p><strong>收货人电话:</strong> ${receiverPhone}</p>`;
    dataHTML += `<p><strong>收货地址:</strong> ${receiverAddress}</p>`;
    dataHTML += `<p><strong>总金额:</strong> ${totalPrice}</p>`;

    document.getElementById('submitted-data').innerHTML = dataHTML;

    // 保存数据到 localStorage
    const submittedData = {
        date,
        note,
        productGroups,
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
