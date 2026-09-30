package com.coding.platform.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.coding.platform.entity.Note;
import com.coding.platform.mapper.NoteMapper;
import com.coding.platform.service.NoteService;
import org.springframework.stereotype.Service;

@Service
public class NoteServiceImpl extends ServiceImpl<NoteMapper, Note> implements NoteService {

    @Override
    public Note getNote(Long userId, Long problemId) {
        LambdaQueryWrapper<Note> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Note::getUserId, userId);
        wrapper.eq(Note::getProblemId, problemId);
        return getOne(wrapper);
    }

    @Override
    public void saveOrUpdateNote(Long userId, Long problemId, String content) {
        Note note = getNote(userId, problemId);
        if (note == null) {
            note = new Note();
            note.setUserId(userId);
            note.setProblemId(problemId);
            note.setContent(content);
            save(note);
        } else {
            note.setContent(content);
            updateById(note);
        }
    }

}
