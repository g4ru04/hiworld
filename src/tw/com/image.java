package tw.com;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Base64;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class image extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LogManager.getLogger(image.class);
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Access-Control-Allow-Origin","*");
		response.setContentType("image/png");
		
		String pic_name_64 = "";
		try{
			String action = request.getParameter("action");
			logger.debug("action: "+action);
			String path = "";
			if("getBuildingIcon".equals(action) || "getPoiIconPath".equals(action)){
				path=getServletConfig().getServletContext().getInitParameter("poiIconPath");
			}else{
				logger.debug("[TransToJSP]");
				response.sendRedirect("./index.jsp" );
			}
			
			pic_name_64 = request.getParameter("pic_name");

			String pic_name = pic_name_64;
			if(pic_name!=null&&!pic_name.equals("")){
				String type ="png";
				logger.debug("to_read: "+path + "/" + pic_name);
				File f = new File(path + "/" + pic_name);
				if(!f.exists() || f.isDirectory()){
					f = new File(path + "/" + pic_name.replace(".png", ".jpg"));
					type ="jpeg";
				}
				if(!f.exists() || f.isDirectory()){
					f = new File(path + "/" + pic_name.replace(".jpg", ".jpeg"));
					type ="jpeg";
				}
				BufferedImage bi = ImageIO.read(f);
				OutputStream out = response.getOutputStream();
				ImageIO.write(bi,type, out);
				out.close();
			}
		} catch (Exception e) {
			e.printStackTrace(System.err);	
			logger.error(e.toString()+" pic_name_64: "+pic_name_64);
		}
	}
}
