document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://polar-chartreuse-silverfish.glitch.me/'
    const tableContainer = document.querySelector('.table-container')
    const vipCheckbox = document.getElementById('vipCheckbox')

    let originalData = [] 

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL)
            const data = await response.json()
            originalData = data 
            createTable(data)
            addSearchFunctionality(data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const createTable = (data) => {
        const table = document.createElement('table')
        table.classList.add('data-table')

        const tableHeader = document.createElement('thead')
        const headerRow = document.createElement('tr')
        const headers = ['ID', 'Photo', 'First Name', 'Last Name', 'City', 'Favorite Color']

        headers.forEach(headerText => {
            const header = document.createElement('th')
            header.textContent = headerText
            headerRow.appendChild(header)
        })

        tableHeader.appendChild(headerRow)
        table.appendChild(tableHeader)

        const tableBody = document.createElement('tbody')
        data.forEach(item => {
            const row = createTableRow(item)
            tableBody.appendChild(row)
        })

        table.appendChild(tableBody)
        tableContainer.appendChild(table)
    }

    const createTableRow = (item) => {
        const { id, name, last_name, city, fav_color, image, vip } = item
        const [firstName, lastName] = name.split(' ')

        const row = document.createElement('tr')
        const rowData = [id, `<img src="${image}" class="user-image">`, firstName, lastName || '', city, fav_color]

        rowData.forEach(cellData => {
            const cell = document.createElement('td')
            if (typeof cellData === 'string' && cellData.startsWith('<')) {
                cell.innerHTML = cellData
            } else {
                cell.textContent = cellData
            }
            row.appendChild(cell)
        })

        return row
    }

    const addSearchFunctionality = (data) => {
        const searchInput = document.createElement('input')
        searchInput.setAttribute('type', 'text')
        searchInput.setAttribute('id', 'searchInput')
        searchInput.setAttribute('placeholder', 'Search by name...')
        tableContainer.parentElement.insertBefore(searchInput, tableContainer)

        searchInput.addEventListener('input', () => {
            const searchText = searchInput.value.toLowerCase()
            filterTableByName(originalData, searchText)
        })
    }

    const filterTableByName = (data, searchText) => {
        const tableBody = document.querySelector('.data-table tbody')
        tableBody.innerHTML = ''

        data.forEach(item => {
            const fullName = `${item.name} ${item.last_name}`.toLowerCase()
            if (fullName.includes(searchText)) {
                const row = createTableRow(item)
                tableBody.appendChild(row)
            }
        })
    }

    const filterTableByVIP = () => {
        const tableBody = document.querySelector('.data-table tbody')
        tableBody.innerHTML = '' 

        originalData.forEach(item => {
            if (vipCheckbox.checked && item.vip === true) {
                const row = createTableRow(item)
                tableBody.appendChild(row)
            } else if (!vipCheckbox.checked) {
                const row = createTableRow(item)
                tableBody.appendChild(row)
            }
        })
    }

    vipCheckbox.addEventListener('change', () => {
        filterTableByVIP()
    })

    fetchData()
})
