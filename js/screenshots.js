let currentResults = [];

async function queryOrders() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const recipient = document.getElementById('recipientQuery').value;
    const company = document.getElementById('companyQuery').value;
    const resultsDiv = document.getElementById('results');
    const downloadBtn = document.getElementById('downloadBtn');

    try {
        // 验证日期范围
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            resultsDiv.innerHTML = '<p class="error-message">开始日期不能晚于结束日期</p>';
            return;
        }

        // 构建查询参数
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (recipient) params.append('recipient', recipient);
        if (company) params.append('company', company);

        // 发送API请求
        const response = await axios.get(`/api/orders?${params.toString()}`);
        currentResults = response.data;

        if (currentResults.length === 0) {
            resultsDiv.innerHTML = '<p class="no-results">未找到订单</p>';
            downloadBtn.disabled = true;
            return;
        }

        // 启用下载按钮
        downloadBtn.disabled = false;

        // 渲染结果
        let html = '<h2>查询结果：</h2>';
        currentResults.forEach((order, index) => {
            html += `
                <div class="order-card">
                    <h3>订单 ${index + 1}</h3>
                    <p><strong>日期：</strong>${formatDate(order.date)}</p>
                    <p><strong>收货人：</strong>${order.recipient}</p>
                    <p><strong>配送方式：</strong>${order.delivery_method}</p>
                    <p><strong>产品：</strong></p>
                    <ul>
                        ${order.products.map(product => `
                            <li>${product.product_name}: ${product.quantity} ${product.unit}</li>
                        `).join('')}
                    </ul>
                    ${order.company ? `<p><strong>装修公司：</strong>${order.company}</p>` : ''}
                </div>
            `;
        });

        resultsDiv.innerHTML = html;
    } catch (error) {
        console.error('Error fetching orders:', error);
        resultsDiv.innerHTML = '<p class="error-message">获取订单信息时出错，请稍后再试</p>';
        downloadBtn.disabled = true;
    }
}

function downloadResults() {
    if (currentResults.length === 0) return;

    // 准备Excel数据
    const workbook = XLSX.utils.book_new();
    const data = currentResults.map(order => ({
        '日期': formatDate(order.date),
        '收货人': order.recipient,
        '配送方式': order.delivery_method,
        '装修公司': order.company || '',
        '产品信息': order.products.map(p => `${p.product_name}: ${p.quantity} ${p.unit}`).join('; ')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, '订单查询结果');

    // 生成文件名
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `订单查询结果_${dateStr}.xlsx`;

    // 下载文件
    XLSX.writeFile(workbook, fileName);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 在页面加载时设置日期输入框的默认值
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    document.getElementById('startDate').value = formatDate(thirtyDaysAgo);
    document.getElementById('endDate').value = formatDate(today);
});