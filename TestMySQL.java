
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestMySQL {
    public static void main(String[] args) {
        String url1 = "jdbc:mysql://localhost:3306/coding_platform?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false&allowPublicKeyRetrieval=true";
        String url2 = "jdbc:mysql://127.0.0.1:3306/coding_platform?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false&allowPublicKeyRetrieval=true";
        String user = "root";
        String password = "Tamako99";
        
        try {
            System.out.println("Testing localhost connection...");
            Connection conn1 = DriverManager.getConnection(url1, user, password);
            System.out.println("✓ localhost connected!");
            Statement stmt1 = conn1.createStatement();
            ResultSet rs1 = stmt1.executeQuery("SELECT 1");
            rs1.next();
            System.out.println("Query result: " + rs1.getInt(1));
            conn1.close();
        } catch (Exception e) {
            System.out.println("✗ localhost failed: " + e.getMessage());
            e.printStackTrace();
        }
        
        try {
            System.out.println("\nTesting 127.0.0.1 connection...");
            Connection conn2 = DriverManager.getConnection(url2, user, password);
            System.out.println("✓ 127.0.0.1 connected!");
            Statement stmt2 = conn2.createStatement();
            ResultSet rs2 = stmt2.executeQuery("SELECT 1");
            rs2.next();
            System.out.println("Query result: " + rs2.getInt(1));
            conn2.close();
        } catch (Exception e) {
            System.out.println("✗ 127.0.0.1 failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
