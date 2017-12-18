package tw.com;

//import java.io.BufferedReader;
//import java.io.File;
//import java.io.FileNotFoundException;
//import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
//import java.sql.CallableStatement;
//import java.sql.Connection;
//import java.sql.DriverManager;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//import java.sql.SQLException;
import java.sql.Timestamp;
//import java.sql.Types;
import java.text.SimpleDateFormat;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.LinkedList;
//import java.util.List;

//import javax.naming.Context;
//import javax.naming.InitialContext;
//import javax.naming.NamingException;
//import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
//import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
//import javax.servlet.http.HttpSession;
//import javax.sql.DataSource;
//import com.google.gson.Gson;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.mail.Message;
//import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;


import javax.mail.Multipart;
//import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
//import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
//import javax.mail.internet.MimeUtility;
import javax.mail.internet.MimeUtility;

import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.google.gson.Gson;

public class SendMail extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LogManager.getLogger(SendMail.class);
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generat¡Cd method stub
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		
		Map<String, String> map =  getFormatedRqstPara(request);
		String action = null2Str(request.getParameter("action"));
		if(request.getParameter("towhom")!=null){
			
			String smtphost = "cloud-pershing-com-tw.mail.protection.outlook.com";
			String username = "pscaber@cloud.pershing.com.tw";
//			String password = null2Str(request.getParameter("pd"));
//			String towhom = null2Str(request.getParameter("towhom"));
//			String title = null2Str(request.getParameter("tt"));
//			String content = null2Str(request.getParameter("co"));
			
			String towhom = new String(Base64.decodeBase64(null2Str(request.getParameter("towhom")).replaceAll("\\\\","\\")),"UTF-8");
			String title = new String(Base64.decodeBase64(null2Str(request.getParameter("tt")).replaceAll("\\\\","\\")),"UTF-8");
			String content = new String(Base64.decodeBase64(null2Str(request.getParameter("cc")).replaceAll("\\\\","\\")),"UTF-8");
			String password = "";
			
	        Properties props = new Properties();
	        props.put("mail.smtp.auth", "true");
	        props.put("mail.smtp.starttls.enable", "false");
	        props.put("mail.smtp.host",smtphost);
	        props.put("mail.smtp.port", "25");
	        
	        Session session = Session.getInstance(props,
  	          new javax.mail.Authenticator() {
  	            protected PasswordAuthentication getPasswordAuthentication() {
  	            	return new PasswordAuthentication(username,password);
  	            }
  	          });
	        
	        try {
	            Message message = new MimeMessage(session);
	            message.setFrom(new InternetAddress(username));
	            message.setRecipients(Message.RecipientType.TO,InternetAddress.parse(towhom));
	            
	            message.setSubject(MimeUtility.encodeText( title,"UTF-8","B"));
//	            message.setSubject(title);
	            MimeBodyPart textPart = new MimeBodyPart();
	            StringBuffer html = new StringBuffer();
	            html.append("<table style='margin:0 auto;padding:0;width:80%;' align='center' border='0' ><tr><td>"
	            			+content
	            			+"</td></tr></table>");
	            textPart.setContent(html.toString(), "text/html; charset=UTF-8");
	            Multipart mmp = new MimeMultipart();
	            mmp.addBodyPart(textPart);
	            message.setContent(mmp);
	            Transport.send(message);
	            response.getWriter().write("success");
	            return;
	        }catch (Exception e) {
	        	StringWriter sw = new StringWriter();
				e.printStackTrace(new PrintWriter(sw));
				logger.debug("Have Encountered Error: "+e.toString());
	        	response.getWriter().write("Error for: "+e.toString()+"");
	        	logger.debug(e.toString());
	        	return;
	        }
		}
	}
	private String null2Str(Object object) {
		if (object instanceof Timestamp)
			return object == null ? "" : new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(object);
		return object == null ? "" : object.toString().trim();
	}
	public static Map<String, String> getFormatedRqstPara(HttpServletRequest request){
		
		Map<String, String[]> oriRqstMap = request.getParameterMap();
		Map<String, String> destRqstMap = new HashMap<String, String>();
		
		for (Map.Entry<String, String[]> entry : oriRqstMap.entrySet()) {
			destRqstMap.put(entry.getKey(), String.join(",",entry.getValue()));
		}
		logger.info("rqstPara: "+new Gson().toJson(oriRqstMap));
		
		return destRqstMap;
	}
}