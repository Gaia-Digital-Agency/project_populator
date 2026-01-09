STEP 1

gcloud auth login
gcloud config set project net1i0-wp

STEP 2

# Create VM, API will be asked, allow Yes and it will auto activate
gcloud compute instances create wordpress-test \
  --zone=asia-southeast1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=10GB \
  --tags=http-server,https-server

# Firewall rules
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 --target-tags=http-server
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 --target-tags=https-server

# SSH IN
gcloud compute ssh wordpress-test --zone=asia-southeast1-a

# Update system
sudo apt update && sudo apt upgrade -y

# Install LAMP
sudo apt install -y apache2 mysql-server php php-mysql php-curl php-gd php-mbstring php-xml php-xmlrpc libapache2-mod-php

# Secure MySQL
sudo mysql_secure_installation

sudo mysql -u root -p
CREATE DATABASE wordpress;
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Download WordPress
cd /var/www/html
sudo wget https://wordpress.org/latest.tar.gz
sudo tar -xzf latest.tar.gz
sudo mv wordpress/* .
sudo rm -rf wordpress latest.tar.gz

# Set permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Restart Apache
sudo systemctl restart apache2

# File Structure
/var/www/html

# System & Installation Checks

# IN LOCAL TERMINAL

# Current project
gcloud config get-value project

# Project details
gcloud projects describe $(gcloud config get-value project)

# Billing status
gcloud billing projects describe $(gcloud config get-value project)

# Current zone setting
gcloud config get-value compute/zone

# Current region setting
gcloud config get-value compute/region

# List all zones available
gcloud compute zones list --filter="region:asia-southeast1"

# List all instances
gcloud compute instances list

# Detailed instance info
gcloud compute instances describe wordpress-test --zone=asia-southeast1-a

# Get external IP only
gcloud compute instances describe wordpress-test \
  --zone=asia-southeast1-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'

# Check instance status
gcloud compute instances describe wordpress-test \
  --zone=asia-southeast1-a \
  --format='get(status)'

# List all firewall rules
gcloud compute firewall-rules list

# Check specific rules
gcloud compute firewall-rules describe allow-http
gcloud compute firewall-rules describe allow-https

# List all firewall rules
gcloud compute firewall-rules list

# Check specific rules
gcloud compute firewall-rules describe allow-http
gcloud compute firewall-rules describe allow-https

# Check External IP
gcloud compute instances describe wordpress-test --zone=asia-southeast1-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)'

# Replace with your actual external IP
EXTERNAL_IP=$(gcloud compute instances describe wordpress-test --zone=asia-southeast1-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "=== GCP Status ==="
echo "Project: $(gcloud config get-value project)"
echo "VM Status: $(gcloud compute instances describe wordpress-test --zone=asia-southeast1-a --format='get(status)')"
echo "External IP: $EXTERNAL_IP"
echo "HTTP Response: $(curl -s -o /dev/null -w '%{http_code}' http://$EXTERNAL_IP)"

# FROM INSIDE VM

# SSH into VM first
gcloud compute ssh wordpress-test --zone=asia-southeast1-a

# Install Git
sudo apt install git -y
git --version
git config --global user.name "Roger"
git config --global user.email "your-email@example.com"

# Add gitignore in "cd /var/www/html"
/wp-admin/
/wp-includes/
/wp-*.php
/index.php
/license.txt
/readme.html
/xmlrpc.php

# Verify ports are open
sudo netstat -tlnp | grep -E ':80|:443'
# Will Ask For Password: Its your Local Terminal USer Password

# Check MySQL service status
sudo systemctl status mysql

# Install netstat
sudo ss -tlnp | grep mysql

# Check MySQL is listening
sudo netstat -tlnp | grep mysql

# Verify MySQL version
mysql --version

# Test database connection
sudo mysql -u root -p -e "SHOW DATABASES;"
# Will be asked for password, its your MySQL root user password

# Verify WordPress database exists
sudo mysql -u root -p -e "SHOW DATABASES LIKE 'wordpress';"

# Verify WordPress user
sudo mysql -u root -p -e "SELECT user, host FROM mysql.user WHERE user='wpuser';"

# Test wpuser connection
mysql -u wpuser -p -e "USE wordpress; SHOW TABLES;"

# Apache status
sudo systemctl status apache2

# Apache version
apache2 -v

# PHP version
php -v

# PHP modules installed
php -m | grep -E 'mysql|curl|gd|mbstring|xml'

# Test PHP processing
echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php
# Then visit: http://[EXTERNAL-IP]/info.php
# DELETE after testing: sudo rm /var/www/html/info.php

# Check WordPress files exist
ls -la /var/www/html/

# Verify wp-config.php exists - ISSUE
ls -la /var/www/html/wp-config.php

# Check ownership - ISSUE
stat /var/www/html/wp-config.php

# Verify permissions
ls -la /var/www/html/ | head -20

# Check WordPress version
grep "wp_version = " /var/www/html/wp-includes/version.php

# Quick connectivity test (from local machine) - Replace With Actual External IP
curl -I http://[EXTERNAL-IP]

# Check if WordPress is responding - Replace with Actual External IP
curl -s http://[EXTERNAL-IP] | grep -i "wordpress"

# Or Visit in Browser
http://[EXTERNAL-IP]

# FULL SERVICE CHECK
echo "=== Service Status ==="
echo "Apache: $(systemctl is-active apache2)"
echo "MySQL: $(systemctl is-active mysql)"
echo ""
echo "=== Listening Ports ==="
sudo netstat -tlnp | grep -E ':80|:3306'
echo ""
echo "=== WordPress DB ==="
sudo mysql -u root -p -e "SHOW DATABASES;" 2>/dev/null
echo ""
echo "=== Disk Usage ==="
df -h /var/www/html

# Remove Appache Index.html if exist
rm /var/www/html/index.html

# FROM TEMINAL
# Get Eternal Ip and Visit Page
gcloud compute instances describe wordpress-test \
  --zone=asia-southeast1-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'

# Create Wordpress From Browser Wordpress Admin Console
Database Name: wordpress
Username: wpuser
Password: StrongPassword123!
Host: localhost
Table Prefix: wp_

# IF SATABSE ISSUE
# IN VM

sudo mysql -u root
-- Check what databases exist
SHOW DATABASES;

-- Create wordpress database (if missing)
CREATE DATABASE IF NOT EXISTS wordpress;

-- Verify it exists now
SHOW DATABASES;

-- Grant permissions again
GRANT ALL PRIVILEGES ON wordpress.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;

-- Verify permissions
SHOW GRANTS FOR 'wpuser'@'localhost';

EXIT;

# Sample Wordpress Build
Site Title: gcp_wordpress_test
Admin: admin
PW: StrongPassword123!
URL: http://34.124.169.139
Email: azlan@net1io.com

# Now Do Git and Development

# If Github Has Issues

sudo chown -R $USER:$USER /var/www/html

# Create SSH Key and Put Into Github

# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"
# use hithub acount email
# Press Enter for defaults

# Display public key
cat ~/.ssh/id_ed25519.pub
ssh -T git@github.com

# GIT COMMIT
cd /var/www/html
git remote add origin git@github.com:YOUR-USERNAME/wordpress-test-site.git
git branch -M main
git commit -m "Initial WordPress setup"
git push -u origin main



