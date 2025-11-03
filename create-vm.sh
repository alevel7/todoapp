# Create resource group and VM
az group create --name todoapp-project --location uksouth

az vm create \
  --resource-group todoapp-project \
  --name todoapp-vm \
  --image Ubuntu2204 \
  --size Standard_D4s_v3 \
  --admin-username azureuser \
  --admin-password 'Cloudwarriors1@' \
  --public-ip-sku Standard

# Open HTTP (port 80)
az vm open-port \
  --resource-group todoapp-project \
  --name todoapp-vm \
  --port 80 \
  --priority 1001

# Show public IP
echo "Your VM public IP:"
az vm show --resource-group todoapp-project --name todoapp-vm --show-details --query publicIps --output tsvcs 