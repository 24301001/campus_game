package com.coding.platform.controller;

import com.coding.platform.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/file")
public class FileController {

    @Value("${file.upload-path:./uploads}")
    private String uploadPath;

    @PostMapping("/upload/avatar")
    public Result<Map<String, String>> uploadAvatar(Authentication authentication, @RequestParam("file") MultipartFile file) {
        try {
            // 检查文件类型
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return Result.error("只允许上传图片文件");
            }

            // 检查文件大小（限制5MB）
            if (file.getSize() > 5 * 1024 * 1024) {
                return Result.error("图片大小不能超过5MB");
            }

            // 创建上传目录
            String datePath = new SimpleDateFormat("yyyy/MM/dd").format(new Date());
            String fullPath = uploadPath + "/" + datePath;
            Path path = Paths.get(fullPath);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFilename = UUID.randomUUID().toString() + extension;

            // 保存文件
            File destFile = new File(fullPath + "/" + newFilename);
            file.transferTo(destFile);

            // 返回文件URL
            String fileUrl = "/api/uploads/" + datePath + "/" + newFilename;
            Map<String, String> result = new HashMap<>();
            result.put("url", fileUrl);

            return Result.success(result);
        } catch (IOException e) {
            e.printStackTrace();
            return Result.error("文件上传失败");
        }
    }
}
