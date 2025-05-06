import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import itemService from "../services/itemService";
import orderService from "../services/orderService";
import clientService from "../services/clientService";
import categoryService from "../services/categoryService";
import adminService from "../services/adminService";
import { 
    Box, Button, Typography, Container, CircularProgress, 
    Paper, Tabs, Tab, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton,
    TextField, Dialog, DialogActions, DialogContent, 
    DialogTitle, FormControl, InputLabel, Select, MenuItem,
    Grid, AppBar, Toolbar, Avatar
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Admin() {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Data states
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [admins, setAdmins] = useState([]);
    
    // Dialog states
    const [itemDialog, setItemDialog] = useState(false);
    const [orderStatusDialog, setOrderStatusDialog] = useState(false);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [adminDialog, setAdminDialog] = useState(false);
    
    // Form states
    const [itemForm, setItemForm] = useState({
        id: null,
        name: "",
        price: "",
        stock: "",
        categoryId: "",
        description: "",
        imageUrl: ""
    });
    const [categoryForm, setCategoryForm] = useState({
        id: null,
        name: ""
    });
    const [orderStatusForm, setOrderStatusForm] = useState({
        id: null,
        status: ""
    });
    const [adminForm, setAdminForm] = useState({
        id: null,
        name: "",
        email: "",
        password: ""
    });
    
    // Current user
    const [currentUser, setCurrentUser] = useState(null);
    
    // Check authentication - only ADMIN role should access this page
    useEffect(() => {
        const isAuthed = localStorage.getItem('isAuthenticated') === 'true';
        const userType = localStorage.getItem('userType');
        
        if (!isAuthed || userType !== 'ADMIN') {
            navigate('/login');
            return;
        }
        
        // Set current user info
        setCurrentUser({
            id: localStorage.getItem('adminId'),
            name: localStorage.getItem('userName'),
            email: localStorage.getItem('userEmail')
        });
        
        fetchAllData();
    }, [navigate]);
    
    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError("");
            
            // Fetch all necessary data in parallel
            const [itemsData, ordersData, clientsData, categoriesData, adminsData] = await Promise.all([
                itemService.getAllItems(),
                orderService.getAllOrders(),
                clientService.getAllClients(),
                categoryService.getAllCategories(),
                adminService.getAllAdmins()
            ]);
            
            // Garantir que todos os dados são arrays, mesmo que vazios
            setItems(Array.isArray(itemsData) ? itemsData : []);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setClients(Array.isArray(clientsData) ? clientsData : []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            setAdmins(Array.isArray(adminsData) ? adminsData : []);
            
            console.log('Dados carregados:', {
                items: itemsData,
                orders: ordersData,
                clients: clientsData,
                categories: categoriesData,
                admins: adminsData
            });
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Failed to load administrative data. Please try again later.');
            
            // Inicializa todos os estados com arrays vazios em caso de erro
            setItems([]);
            setOrders([]);
            setClients([]);
            setCategories([]);
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
    
    // Item Management Functions
    const openItemDialog = (item = null) => {
        if (item) {
            setItemForm({
                id: item.id,
                name: item.name,
                price: item.price,
                stock: item.stock,
                categoryId: item.category?.id || "",
                description: item.description || "",
                imageUrl: item.imageUrl || ""
            });
        } else {
            setItemForm({
                id: null,
                name: "",
                price: "",
                stock: "",
                categoryId: "",
                description: "",
                imageUrl: ""
            });
        }
        setItemDialog(true);
    };
    
    const handleItemFormChange = (e) => {
        const { name, value } = e.target;
        setItemForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const saveItem = async () => {
        try {
            const formData = {
                ...itemForm,
                price: parseFloat(itemForm.price),
                stock: parseInt(itemForm.stock, 10),
                categoryId: parseInt(itemForm.categoryId, 10)
            };
            
            if (itemForm.id) {
                // Update existing item
                await itemService.updateItem(itemForm.id, formData);
            } else {
                // Create new item
                await itemService.createItem(formData);
            }
            
            setItemDialog(false);
            fetchAllData();
        } catch (err) {
            console.error('Error saving item:', err);
            alert('Failed to save item. Please try again.');
        }
    };
    
    const deleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await itemService.deleteItem(id);
                fetchAllData();
            } catch (err) {
                console.error('Error deleting item:', err);
                alert('Failed to delete item. Please try again.');
            }
        }
    };
    
    // Category Management Functions
    const openCategoryDialog = (category = null) => {
        if (category) {
            setCategoryForm({
                id: category.id,
                name: category.name
            });
        } else {
            setCategoryForm({
                id: null,
                name: ""
            });
        }
        setCategoryDialog(true);
    };
    
    const handleCategoryFormChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const saveCategory = async () => {
        try {
            if (categoryForm.id) {
                // Update existing category
                await categoryService.updateCategory(categoryForm.id, categoryForm);
            } else {
                // Create new category
                await categoryService.createCategory(categoryForm);
            }
            
            setCategoryDialog(false);
            fetchAllData();
        } catch (err) {
            console.error('Error saving category:', err);
            alert('Failed to save category. Please try again.');
        }
    };
    
    const deleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category? All associated items will be affected.')) {
            try {
                await categoryService.deleteCategory(id);
                fetchAllData();
            } catch (err) {
                console.error('Error deleting category:', err);
                alert('Failed to delete category. Please try again.');
            }
        }
    };
    
    // Order Management Functions
    const openOrderStatusDialog = (order) => {
        setOrderStatusForm({
            id: order.id,
            status: order.status || ""
        });
        setOrderStatusDialog(true);
    };
    
    const handleOrderStatusChange = (e) => {
        setOrderStatusForm(prev => ({
            ...prev,
            status: e.target.value
        }));
    };
    
    const updateOrderStatus = async () => {
        try {
            await orderService.updateOrderStatus(orderStatusForm.id, { status: orderStatusForm.status });
            setOrderStatusDialog(false);
            fetchAllData();
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status. Please try again.');
        }
    };
    
    // Admin Management Functions
    const openAdminDialog = (admin = null) => {
        if (admin) {
            setAdminForm({
                id: admin.id,
                name: admin.name,
                email: admin.email,
                password: "" // Don't populate password for security
            });
        } else {
            setAdminForm({
                id: null,
                name: "",
                email: "",
                password: ""
            });
        }
        setAdminDialog(true);
    };
    
    const handleAdminFormChange = (e) => {
        const { name, value } = e.target;
        setAdminForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const saveAdmin = async () => {
        try {
            const formData = { ...adminForm };
            
            if (adminForm.id) {
                // Update existing admin
                // If password is empty, don't send it
                if (!formData.password) {
                    delete formData.password;
                }
                await adminService.updateAdmin(adminForm.id, formData);
            } else {
                // Create new admin
                await adminService.createAdmin(formData);
            }
            
            setAdminDialog(false);
            fetchAllData();
        } catch (err) {
            console.error('Error saving admin:', err);
            alert('Failed to save admin. Please try again.');
        }
    };
    
    const deleteAdmin = async (id) => {
        // Prevent deleting your own account
        const currentUserId = currentUser?.id;
        if (currentUserId === id) {
            alert("You cannot delete your own admin account.");
            return;
        }
        
        if (window.confirm('Are you sure you want to delete this admin user?')) {
            try {
                await adminService.deleteAdmin(id);
                fetchAllData();
            } catch (err) {
                console.error('Error deleting admin:', err);
                alert('Failed to delete admin. Please try again.');
            }
        }
    };
    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        <>
            {/* App Bar with logout button */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {currentUser && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', mr: 1 }}>
                                    {currentUser.name?.charAt(0)}
                                </Avatar>
                                <Typography variant="body2">{currentUser.name}</Typography>
                            </Box>
                        )}
                        <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            
            <Container sx={{ paddingTop: 4, paddingBottom: 5 }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
                            <Tab label="Products" />
                            <Tab label="Categories" />
                            <Tab label="Orders" />
                            <Tab label="Customers" />
                            <Tab label="Admins" />
                        </Tabs>
                    </Box>
                    
                    {/* Products Tab */}
                    <Box role="tabpanel" hidden={tabValue !== 0} sx={{ p: 3 }}>
                        {tabValue === 0 && (
                            <>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<AddIcon />}
                                    onClick={() => openItemDialog()}
                                    sx={{ mb: 2 }}
                                >
                                    Add Product
                                </Button>
                                
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Stock</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {items.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.id}</TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>R${item.price?.toFixed(2)}</TableCell>
                                                    <TableCell>{item.stock}</TableCell>
                                                    <TableCell>{item.category?.name}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => openItemDialog(item)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => deleteItem(item.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </Box>
                    
                    {/* Categories Tab */}
                    <Box role="tabpanel" hidden={tabValue !== 1} sx={{ p: 3 }}>
                        {tabValue === 1 && (
                            <>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<AddIcon />}
                                    onClick={() => openCategoryDialog()}
                                    sx={{ mb: 2 }}
                                >
                                    Add Category
                                </Button>
                                
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {categories.map(category => (
                                                <TableRow key={category.id}>
                                                    <TableCell>{category.id}</TableCell>
                                                    <TableCell>{category.name}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => openCategoryDialog(category)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => deleteCategory(category.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </Box>
                    
                    {/* Orders Tab */}
                    <Box role="tabpanel" hidden={tabValue !== 2} sx={{ p: 3 }}>
                        {tabValue === 2 && (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order ID</TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>Payment Date</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.map(order => (
                                            <TableRow key={order.id}>
                                                <TableCell>{order.id}</TableCell>
                                                <TableCell>{order.client?.name}</TableCell>
                                                <TableCell>R${order.total?.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    {order.paymentDate ? new Date(order.paymentDate).toLocaleDateString() : 'N/A'}
                                                </TableCell>
                                                <TableCell>{order.status || 'Processing'}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => openOrderStatusDialog(order)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                    
                    {/* Customers Tab */}
                    <Box role="tabpanel" hidden={tabValue !== 3} sx={{ p: 3 }}>
                        {tabValue === 3 && (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {clients.map(client => (
                                            <TableRow key={client.id}>
                                                <TableCell>{client.id}</TableCell>
                                                <TableCell>{client.name}</TableCell>
                                                <TableCell>{client.email}</TableCell>
                                                <TableCell>{client.role || 'CLIENT'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                    
                    {/* Admins Tab */}
                    <Box role="tabpanel" hidden={tabValue !== 4} sx={{ p: 3 }}>
                        {tabValue === 4 && (
                            <>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<AddIcon />}
                                    onClick={() => openAdminDialog()}
                                    sx={{ mb: 2 }}
                                >
                                    Add Admin
                                </Button>
                                
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {admins.map(admin => (
                                                <TableRow key={admin.id}>
                                                    <TableCell>{admin.id}</TableCell>
                                                    <TableCell>{admin.name}</TableCell>
                                                    <TableCell>{admin.email}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => openAdminDialog(admin)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        {admin.id !== currentUser?.id && (
                                                            <IconButton onClick={() => deleteAdmin(admin.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </Box>
                </Paper>
                
                {/* Item Dialog */}
                <Dialog open={itemDialog} onClose={() => setItemDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>{itemForm.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    label="Product Name"
                                    value={itemForm.name}
                                    onChange={handleItemFormChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="categoryId"
                                        value={itemForm.categoryId}
                                        onChange={handleItemFormChange}
                                        label="Category"
                                    >
                                        {categories.map(category => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="price"
                                    label="Price"
                                    type="number"
                                    value={itemForm.price}
                                    onChange={handleItemFormChange}
                                    fullWidth
                                    required
                                    inputProps={{ step: "0.01", min: "0" }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="stock"
                                    label="Stock"
                                    type="number"
                                    value={itemForm.stock}
                                    onChange={handleItemFormChange}
                                    fullWidth
                                    required
                                    inputProps={{ min: "0" }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="description"
                                    label="Description"
                                    value={itemForm.description}
                                    onChange={handleItemFormChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="imageUrl"
                                    label="Image URL"
                                    value={itemForm.imageUrl}
                                    onChange={handleItemFormChange}
                                    fullWidth
                                    placeholder="https://example.com/image.jpg"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setItemDialog(false)}>Cancel</Button>
                        <Button onClick={saveItem} variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                
                {/* Category Dialog */}
                <Dialog open={categoryDialog} onClose={() => setCategoryDialog(false)}>
                    <DialogTitle>{categoryForm.id ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            label="Category Name"
                            value={categoryForm.name}
                            onChange={handleCategoryFormChange}
                            fullWidth
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCategoryDialog(false)}>Cancel</Button>
                        <Button onClick={saveCategory} variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                
                {/* Order Status Dialog */}
                <Dialog open={orderStatusDialog} onClose={() => setOrderStatusDialog(false)}>
                    <DialogTitle>Update Order Status</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={orderStatusForm.status}
                                onChange={handleOrderStatusChange}
                                label="Status"
                            >
                                <MenuItem value="PROCESSING">Processing</MenuItem>
                                <MenuItem value="SHIPPED">Shipped</MenuItem>
                                <MenuItem value="DELIVERED">Delivered</MenuItem>
                                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOrderStatusDialog(false)}>Cancel</Button>
                        <Button onClick={updateOrderStatus} variant="contained" color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
                
                {/* Admin Dialog */}
                <Dialog open={adminDialog} onClose={() => setAdminDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>{adminForm.id ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    label="Admin Name"
                                    value={adminForm.name}
                                    onChange={handleAdminFormChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    value={adminForm.email}
                                    onChange={handleAdminFormChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="password"
                                    label={adminForm.id ? "New Password (leave blank to keep current)" : "Password"}
                                    type="password"
                                    value={adminForm.password}
                                    onChange={handleAdminFormChange}
                                    fullWidth
                                    required={!adminForm.id}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAdminDialog(false)}>Cancel</Button>
                        <Button onClick={saveAdmin} variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}