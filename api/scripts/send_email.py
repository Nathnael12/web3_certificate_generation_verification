import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import sys
import os

cwd = os.getcwd()
sys.path.append(f'{cwd}/api')
from config import EPASS
def send(asset_id,receiver_address):

    mail_content = f'''Hello,\nThis is to inform you that your certificate is prepared. Once your overdue payment is made, you can opt-in using the following asset id.\nThank you!\nasset id: {asset_id}'''
    #The mail addresses and password
    sender_address = 'davejonathan199@gmail.com'
    sender_pass = EPASS
    #Setup the MIME
    message = MIMEMultipart()
    message['From'] = "TenX Team"
    message['To'] = receiver_address
    message['Subject'] = 'Your Certificate is Ready.'   #The subject line
    #The body and the attachments for the mail
    message.attach(MIMEText(mail_content, 'plain'))
    #Create SMTP session for sending the mail
    session = smtplib.SMTP('smtp.gmail.com', 587) #use gmail with port
    session.starttls() #enable security
    session.login(sender_address, sender_pass) #login with mail_id and password
    text = message.as_string()
    session.sendmail(sender_address, receiver_address, text)
    session.quit()
    print('Mail Sent')