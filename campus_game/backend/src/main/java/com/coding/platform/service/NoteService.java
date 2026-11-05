package com.coding.platform.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.coding.platform.entity.Note;

public interface NoteService extends IService<Note> {

    Note getNote(Long userId, Long problemId);

    void saveOrUpdateNote(Long userId, Long problemId, String content);

}
