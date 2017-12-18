package tw.com;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.sql.*;
import java.util.*;
import java.util.Base64;


public class PoiHiyes extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LogManager.getLogger(PoiHiyes.class);
	protected void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}
	
	protected void doPost(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		
		String action = null2Str(request.getParameter("action"));
		logger.debug("action: "+action);
		try {
			if("select_POI_hiyes".equals(action)){
				
				String lat = null2Str(request.getParameter("lat"));
				String lng = null2Str(request.getParameter("lng"));
				String radius = null2Str(request.getParameter("radius"));
				String token = null2Str(request.getParameter("token"));
				logger.debug("lat: "+lat);
				logger.debug("lng: "+lng);
				logger.debug("radius: "+radius);
				logger.debug("token: "+token);
				
				final Base64.Encoder base64encoder = Base64.getEncoder();
				String conString=getServletConfig().getServletContext().getInitParameter("poiWebservice")
						+ "type=c2VsZWN0X1BPSV9oaXllcw=="
						+ "&lati="+base64encoder.encodeToString(lat.getBytes("UTF-8"))
						+ "&long="+base64encoder.encodeToString(lng.getBytes("UTF-8"))
						+ "&radi="+base64encoder.encodeToString(radius.getBytes("UTF-8"))
						+ "&toke="+base64encoder.encodeToString(token.getBytes("UTF-8"));
				logger.debug("conString: "+conString);
				
				HttpClient client = new HttpClient();
				HttpMethod method= new GetMethod(conString); 
				
				try{
					client.executeMethod(method);
				}catch(Exception e){
					logger.error(e.toString()); 
				}

				InputStream result_stream = method.getResponseBodyAsStream();
				
				byte[] buffer = new byte[2048];
		        int readBytes = 0;
		        StringBuilder stringBuilder = new StringBuilder();
		        while((readBytes = result_stream.read(buffer)) > 0){
		            stringBuilder.append(new String(buffer, 0, readBytes));
		        }
		        String result = stringBuilder.toString();
				
				method.releaseConnection();
				logger.debug("result: "+(
						result.length()>200
							?result.substring(0, 180)+"..."
							:result
					));
				response.getWriter().write(result);

			}else if("check_token".equals(action)){
				String token = null2Str(request.getParameter("token"));
				logger.debug("token: "+token);
				
				if(token.equals(getServletConfig().getServletContext().getInitParameter("token"))){
					logger.debug("answer: "+"success");
					response.getWriter().write("success");
				}else{
					logger.debug("answer: "+"fail");
					response.getWriter().write("fail");
				}
			}else if("btoa".equals(action)){
				
				String base64Str = null2Str(request.getParameter("base64Str"));
				logger.debug("base64Str: "+base64Str);
				final Base64.Decoder decoder = Base64.getDecoder();
				String str = new String(
					decoder.decode(
						null2Str(base64Str)
					)
				, "UTF-8");
				logger.debug("str: "+str);
				response.getWriter().write(str);
				
			}else{
				logger.debug("[TransToJSP]");
				response.sendRedirect("./index.jsp");
			}
		} catch (Exception e) {
			response.getWriter().write("fail!");
			e.printStackTrace(System.err);
			logger.debug(e.toString());
			
		}
	}
	private String null2Str(Object object) {
		if (object instanceof Timestamp)
			return object == null ? "" : new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(object);
		return object == null ? "" : object.toString().trim();
	}
}