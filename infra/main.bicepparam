using './main.bicep'

param staticWebAppName = 'swa-group-protected-admin'
param location = 'eastus2'
param sku = 'Free'
param tags = {
  environment: 'production'
  application: 'swa-group-protected-admin'
}
