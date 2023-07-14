package com.example.myFirstApp;
import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin("http://localhost:4200")
@RestController
public class Controller {
	private String path;
	private List<shape> arrOfShapes =new ArrayList<shape>(); 
	private List<shape> loadedShapes= new ArrayList<shape>();
	
	@PostMapping("/path")
	public String takePath(@RequestBody String path) {
		this.path=path;
		System.out.println(path);
		return "path sent successfully";
	}
	@PostMapping("/shapes")
	public String takeShapes(@RequestBody List<shape> shapes ) throws IOException{
		 for(shape s: shapes) {
			 arrOfShapes.add(s);
		 }
		 System.out.println(arrOfShapes);
		 FileOutputStream fos = new FileOutputStream(path);
		 if(path.contains(".xml")) {
			  XMLEncoder encoder = new XMLEncoder(fos);
			  encoder.writeObject(arrOfShapes);
			  encoder.close();
	          fos.close();
		 }
		 
		 else if(path.contains(".json")) {
			 ObjectMapper mapper = new ObjectMapper();
			 mapper.writeValue(fos, arrOfShapes);
		 }
		 
		 else {
			 fos.close();
			 return "not available";
		 }
		 arrOfShapes.clear();
          System.out.println("done");
		return "added successfully";
	}
	@PostMapping("/load")
	public Object loadShapes(@RequestBody String path) throws IOException{
		this.path=path;
		System.out.println(path);
		FileInputStream fis = new FileInputStream(path);
		if(path.contains(".xml")) {
		//converting XML into Object
		XMLDecoder decoder = new XMLDecoder(fis);
		Object ob=decoder.readObject();
		 decoder.close();
         fis.close();
		System.out.println(ob);
		return ob;
		}
		else if(path.contains(".json")) {
			 ObjectMapper map = new ObjectMapper();
             TypeReference tr = new TypeReference<List<shape>>() {};
             this.loadedShapes.addAll((List<shape>) map.readValue(fis, tr));
             fis.close();
		}
		return loadedShapes;
	}
	
	
}
