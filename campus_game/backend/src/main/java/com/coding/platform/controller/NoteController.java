package com.coding.platform.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.coding.platform.common.Result;
import com.coding.platform.entity.Note;
import com.coding.platform.entity.User;
import com.coding.platform.service.NoteService;
import com.coding.platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/note")
public class NoteController {

    @Autowired
    private NoteService noteService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/detail")
    public Result<Note> getNote(Authentication authentication, @RequestParam Long problemId) {
        Long userId = (Long) authentication.getPrincipal();
        Note note = noteService.getNote(userId, problemId);
        return Result.success(note);
    }

    @GetMapping("/list")
    public Result<List<Map<String, Object>>> getNoteList(@RequestParam Long problemId) {
        LambdaQueryWrapper<Note> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Note::getProblemId, problemId)
              .orderByDesc(Note::getCreateTime);
        
        List<Note> notes = noteService.list(wrapper);
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Note note : notes) {
            Map<String, Object> noteMap = new HashMap<>();
            noteMap.put("id", note.getId());
            noteMap.put("userId", note.getUserId());
            noteMap.put("problemId", note.getProblemId());
            noteMap.put("content", note.getContent());
            noteMap.put("likeCount", note.getLikeCount());
            noteMap.put("createTime", note.getCreateTime());
            
            User user = userService.getById(note.getUserId());
            if (user != null) {
                noteMap.put("nickname", user.getNickname());
                noteMap.put("username", user.getUsername());
                noteMap.put("avatar", user.getAvatar());
            }
            
            result.add(noteMap);
        }
        
        return Result.success(result);
    }

    @PostMapping("/save")
    public Result<Void> saveNote(Authentication authentication, @RequestBody Map<String, Object> params) {
        Long userId = (Long) authentication.getPrincipal();
        Long problemId = Long.valueOf(params.get("problemId").toString());
        String content = params.get("content").toString();
        noteService.saveOrUpdateNote(userId, problemId, content);
        return Result.success();
    }

}
